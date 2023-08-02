import { UserService } from './user.service';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';

import 'dotenv/config';
import UserCreateDTO from './dto/login-dto';
import { compareSync, hashSync } from 'bcrypt';
import UserLoginDTO from './dto/create-dto';
import userEntity, { UserSelect } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, response } from 'express';
import { TokenService } from './token/token.service';

import * as speakeasy from 'speakeasy';

import { and, eq, gte } from 'drizzle-orm';
import tokenEntity, { tokenSelect } from './entities/revokeToken.entity';
import { OAuth2Client } from 'google-auth-library';

@Controller()
export class UserController {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private tokenService: TokenService,
  ) {}
  @Post('register')
  async register(@Body() userBody: UserCreateDTO) {
    if (userBody.password !== userBody.password_confirm) {
      throw new BadRequestException('Password do not match');
    }
    return this.userService.save({
      first_name: userBody.first_name,
      last_name: userBody.last_name,
      email: userBody.email,
      password: await hashSync(userBody.password, 12),
    });
  }

  @Post('login')
  async login(
    @Body() loginBody: UserLoginDTO,
    @Res({
      passthrough: true,
    })
    response: Response,
  ) {
    const user = await this.userService.findOne(
      eq(userEntity.email, loginBody.email),
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credencials');
    }

    if (!(await compareSync(loginBody.password, user.password))) {
      throw new BadRequestException('Invalid credencials');
    }

    response.status(200);

    if (user.tfa_secret) {
      return {
        id: user.id,
      };
    }
    const secret = speakeasy.generateSecret({
      name: 'My App',
    });

    return {
      id: user.id,
      secret: secret.ascii,
      otpauth_url: secret.otpauth_url,
    };
  }

  @Post('two-factor')
  async twoFactor(
    @Body('id') id: number,
    @Body('code') code: string,
    @Res({ passthrough: true }) response: Response,
    @Body('secret') secret: string,
  ) {
    const user = await this.userService.findOne(eq(userEntity.id, id));

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    if (!secret) {
      secret = user.tfa_secret;
    }

    const verify = speakeasy.totp.verify({
      secret,
      encoding: 'ascii',
      token: code,
    });

    if (!verify) {
      throw new BadRequestException('Invalid credentials');
    }

    if (user.tfa_secret === '') {
      await this.userService.update(eq(userEntity.id, id), {
        tfa_secret: secret,
      });
    }

    const accessToken = await this.jwtService.signAsync(
      { id },
      {
        expiresIn: '30s',
      },
    );

    const refreshToken = await this.jwtService.signAsync({
      id,
    });

    const expired_at = new Date();
    expired_at.setDate(expired_at.getDate() + 7);

    await this.tokenService.save({
      user_id: user.id,
      token: refreshToken,
      expiredAt: expired_at,
    });
    response.status(200);
    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 100,
    });
    return {
      token: accessToken,
    };
  }

  @Get('user')
  async user(@Req() request: Request) {
    try {
      const accessToken = request.headers.authorization
        .replace('Bearer', '')
        .trim();
      const { id } = await this.jwtService.verifyAsync(accessToken);
      const { password, ...user } = await this.userService.findOne(
        eq(userEntity.id, id),
      );
      return user;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  @Post('refresh')
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      const refreshToken = request.cookies['refresh_token'];

      const { id } = await this.jwtService.verifyAsync(refreshToken);

      const tokenEntityFind: tokenSelect = await this.tokenService.findOne(
        and(
          eq(tokenEntity.user_id, id),
          gte(tokenEntity.expiredAt, new Date()),
        ),
      );

      if (!tokenEntityFind) {
        throw new UnauthorizedException();
      }
      const accessToken = await this.jwtService.signAsync(
        { id },
        { expiresIn: '30s' },
      );
      response.status(200);

      return { accessToken };
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  @Post('google-auth')
  async googleAuth(
    @Body('token') token: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const client = new OAuth2Client(process.env.ID_GOOGLE_CLIENT);

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.ID_GOOGLE_CLIENT,
    });

    const googleUser = ticket.getPayload();

    if (!googleUser) {
      throw new UnauthorizedException();
    }

    let user = await this.userService.findOne(
      eq(userEntity.email, googleUser.email),
    );

    if (!user) {
      user = await this.userService.save({
        first_name: googleUser.given_name,
        last_name: googleUser.family_name,
        email: googleUser.email,
        password: await hashSync(token, 12),
      });
    }

    const accessToken = await this.jwtService.signAsync(
      { id: user.id },
      {
        expiresIn: '30s',
      },
    );

    const refreshToken = await this.jwtService.signAsync({
      id: user.id,
    });

    const expired_at = new Date();
    expired_at.setDate(expired_at.getDate() + 7);

    await this.tokenService.save({
      user_id: user.id,
      token: refreshToken,
      expiredAt: expired_at,
    });
    response.status(200);
    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 100,
    });
    return {
      token: accessToken,
    };
  }

  @Post('logout')
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = request.cookies['refresh_token'];

    await this.tokenService.delete(eq(tokenEntity.token, refreshToken));

    response.clearCookie('refres_token');
    response.status(200);
    return {
      message: 'success',
    };
  }
}
