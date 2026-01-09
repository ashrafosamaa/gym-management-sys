import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserController } from '../user/user.controller';
import { UserService } from '../user/user.service';
import { models } from '../DB/model-generation';


@Module({
  imports: [models],
  controllers: [UserController],
  providers: [UserService, JwtService]
})
export class UserModule {}
