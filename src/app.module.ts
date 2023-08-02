import { Module } from '@nestjs/common';
import { DrizzleModule } from './drizzle/drizzle.module';
import { ConfigModule } from '@nestjs/config';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { ResetController } from './reset/reset.controller';
import { ResetService } from './reset/reset.service';
import { ResetModule } from './reset/reset.module';

@Module({
  imports: [
    DrizzleModule,
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    ResetModule,
  ],
})
export class AppModule {}
