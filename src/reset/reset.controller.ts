import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { ResetService } from './reset.service';
import { ForgotDTO } from './dto/forgot.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { ResetDTO } from './dto/reset.dto';
import { eq } from 'drizzle-orm';
import resetEntity from './entities/reset.entity';
import { UserService } from 'src/user/user.service';
import userEntity from 'src/user/entities/user.entity';
import { hashSync } from 'bcrypt';

@Controller()
export class ResetController {
  constructor(
    private readonly resetService: ResetService,
    private readonly mailerService: MailerService,
    private readonly userService: UserService,
  ) {}

  @Post('forgot')
  async forgot(@Body() emailPayload: ForgotDTO) {
    const token = Math.random().toString(20).substring(2, 12);
    const email: string = emailPayload.email;

    await this.resetService.save({ email, token });

    const url = `http://localhost:4200/reset/${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Reset your password',
      html: `Click <a href="${url}">here</a> here to reset your password!`,
    });

    return {
      message: 'Success',
    };
  }

  @Post('reset')
  async reset(@Body() { password, password_confirm, token }: ResetDTO) {
    if (password != password_confirm) {
      throw new BadRequestException('Password do not match!');
    }

    const reset = await this.resetService.findOne(eq(resetEntity.token, token));

    const user = await this.userService.findOne(
      eq(userEntity.email, reset.email),
    );

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userService.updatePassword(eq(userEntity.id, user.id), {
      password: await hashSync(password, 12),
    });

    return { 
      message: 'success',
    };
  }
}
