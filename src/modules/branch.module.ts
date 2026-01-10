import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BranchController } from '../branch/branch.controller';
import { BranchService } from '../branch/branch.service';
import { models } from '../DB/model-generation';


@Module({
  imports: [models],
  controllers: [BranchController],
  providers: [BranchService, JwtService]
})
export class BranchModule {}
