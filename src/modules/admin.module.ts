import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminController } from '../admin/admin.controller';
import { AdminService } from '../admin/admin.service';
import { models } from '../DB/model-generation';


@Module({
  imports: [models],
  controllers: [AdminController],
  providers: [AdminService, JwtService]
})
export class AdminModule {}
