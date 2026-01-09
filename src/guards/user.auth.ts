import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../DB/models/user.model';


@Injectable()
export class AuthUserGuard implements CanActivate {
    constructor(
        private jwtService : JwtService,
        @InjectModel(User.name) private userModel : Model<User>,
    ) { }
    async canActivate(
        context : ExecutionContext,
    ) : Promise<object> {
        const req = context.switchToHttp().getRequest()

        const { accesstoken } = req.headers
        if (!accesstoken) throw new BadRequestException('Pleaee lognIn first')

        const decodedData = this.jwtService.verify(accesstoken, { secret: process.env.JWT_SECRET_LOGIN })
        if (!decodedData.id) throw new BadRequestException('Invalid token payload')

        const user = await this.userModel.findById(decodedData.id).select(' _id firstName email role')
        if (!user) throw new BadRequestException('Unauthorized, Please signup first')

        req.authUser = user
        return req
    }
}
