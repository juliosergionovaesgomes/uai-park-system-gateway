import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { DrizzleModule } from 'src/drizzle/drizzle.module';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './token/token.service';
import 'dotenv/config';
@Module({
  imports: [
    DrizzleModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1w' },
    }),
  ],
  controllers: [UserController],
  providers: [UserService, TokenService],
  exports: [UserService],
})
export class UserModule {}
