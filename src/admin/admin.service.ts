import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin } from 'src/DB/models/admin.model';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'


@Injectable()
export class AdminService {

    constructor(
        @InjectModel(Admin.name) private adminModel : Model<Admin>,
        private jwtService : JwtService,
    ) {}

    async createAdmin(body: any, req: any) {
        const { username, password } = body
        if(req.authAdmin.role != 'king') throw new UnauthorizedException('Unauthorized, You are not the king admin')
        const admin = await this.adminModel.findOne({ username })
        if(admin) throw new BadRequestException('Admin username is already exists')
        const hashPassword = bcrypt.hashSync(password, +process.env.SALT_ROUNDS_1)
        await this.adminModel.create({ username, password: hashPassword, role:'admin'})
        return true
    }

    async login(body: any) {
        const { username, password } = body
        const admin = await this.adminModel.findOne({ username })
        if(!admin) throw new BadRequestException('Invalid login credentials')
        if(!bcrypt.compareSync(password, admin.password)) throw new BadRequestException('Invalid login credentials')
        const adminToken = this.jwtService.sign({ id: admin._id, name: admin.username, role: admin.role },
            { secret: process.env.JWT_SECRET_LOGIN, expiresIn: "90d" })
        return adminToken
    }

    async getAdmin(req: any) {
        const admin = await this.adminModel.findById(req.authAdmin.id).select(' username role')
        if(!admin) throw new NotFoundException('Admin not found')
        return admin
    }

    async getAllAdmins(req: any) {
        if(req.authAdmin.role != 'king') throw new UnauthorizedException('Unauthorized, You are not the king admin')
        const admins = await this.adminModel.find().select(' username role')
        if(!admins.length) throw new NotFoundException('No admins found')
        return admins
    }

    async updateMyPassword(body: any, req: any) {
        const { oldPassword, password } = body
        const admin = await this.adminModel.findById(req.authAdmin.id)
        if(!bcrypt.compareSync(oldPassword, admin.password)) throw new BadRequestException('Invalid old password')
        const hashPassword = bcrypt.hashSync(password, +process.env.SALT_ROUNDS_1)
        admin.password = hashPassword
        await admin.save()
        return true
    }

    async deleteAdmin(req: any, param: any) {
        if(req.authAdmin.role != 'king') throw new UnauthorizedException('Unauthorized, You are not the king admin')
        const admin = await this.adminModel.findById(param.adminId)
        if(!admin) throw new NotFoundException('Admin not found')
        await admin.deleteOne()
        return true
    }

}
