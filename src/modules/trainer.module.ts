import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { models } from '../DB/model-generation';
import { TrainerController } from 'src/trainer/trainer.controller';
import { TrainerService } from 'src/trainer/trainer.service';


@Module({
  imports: [models],
  controllers: [TrainerController],
  providers: [TrainerService, JwtService]
})
export class TrainerModule {}
