import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserAuthController } from '../user-auth/user-auth.controller';
import { UserAuthService } from '../user-auth/user-auth.service';
import { models } from '../DB/model-generation';
import { SendEmailService } from '../common/send-email.service';


@Module({
  imports: [models],
  controllers: [UserAuthController],
  providers: [UserAuthService, JwtService, SendEmailService]
})
export class UserAuthModule {}
