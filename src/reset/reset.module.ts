import { Module } from '@nestjs/common';
import { ResetService } from './reset.service';
import { ResetController } from './reset.controller';
import { DrizzleModule } from 'src/drizzle/drizzle.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    DrizzleModule,
    UserModule,
    MailerModule.forRoot({
      transport: {
        host: 'localhost',
        port: 8003,
      },
      defaults: {
        from: 'from@example.com',
      },
    }),
  ],
  providers: [ResetService],
  controllers: [ResetController],
})
export class ResetModule {}
