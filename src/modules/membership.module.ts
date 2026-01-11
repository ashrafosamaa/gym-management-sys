import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MembershipController } from '../membership/membership.controller';
import { MembershipService } from '../membership/membership.service';
import { models } from '../DB/model-generation';


@Module({
  imports: [models],
  controllers: [MembershipController],
  providers: [MembershipService, JwtService]
})
export class MembershipModule {}
