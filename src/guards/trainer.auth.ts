import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Trainer } from '../DB/models/trainer.model';


@Injectable()
export class AuthTrainerGuard implements CanActivate {
    constructor(
        private jwtService : JwtService,
        @InjectModel(Trainer.name) private trainerModel : Model<Trainer>,
    ) { }
    async canActivate(
        context : ExecutionContext,
    ) : Promise<object> {
        const req = context.switchToHttp().getRequest()

        const { accesstoken } = req.headers
        if (!accesstoken) throw new BadRequestException('Pleaee lognIn first')

        const decodedData = this.jwtService.verify(accesstoken, { secret: process.env.JWT_SECRET_LOGIN })
        if (!decodedData.id) throw new BadRequestException('Invalid token payload')

        const trainer = await this.trainerModel.findById(decodedData.id).select(' _id firstName role')
        if (!trainer) throw new BadRequestException('Unauthorized, Please signup first')

        req.authTrainer = trainer
        return req
    }
}
