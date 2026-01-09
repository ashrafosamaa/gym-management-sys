import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../DB/models/user.model';
import { JwtService } from '@nestjs/jwt';
import { SendEmailService } from '../common/send-email.service';
import * as bcrypt from 'bcrypt'


@Injectable()
export class UserAuthService {
    constructor(
        @InjectModel(User.name) private userModel : Model<User>,
        private sendEmailService : SendEmailService,
        private jwtService : JwtService
    ) {}

    async signUp(body: any) {
        const isEmailExist = await this.userModel.findOne({email : body.email})
        if(isEmailExist) throw new BadRequestException('Email already exists')
        const isPhoneExist = await this.userModel.findOne({phone : body.phone})
        if(isPhoneExist) throw new BadRequestException('Phone already exists')
        const hashPassword = bcrypt.hashSync(body.password, +process.env.SALT_ROUNDS)
        const activateCode = Math.floor(1000 + Math.random() * 9000).toString();
        const accountActivateCode = bcrypt.hashSync(activateCode, +process.env.SALT_ROUNDS)
        // send confirmation email
        try{
            await this.sendEmailService.sendEmail(
                body.email,
                "Verification Code (valid right now for you)",
                `Hi ${body.firstName},\nYour verification code is ${activateCode}.
                \nEnter this code to access our [website] to activate your account.
                \nWe’re glad you’re here!`,
            )
        }
        catch{
            throw new InternalServerErrorException(`Email not sent, please try again`);
        }
        await this.userModel.create({ firstName : body.firstName, lastName : body.lastName, email : body.email, password : hashPassword,
            phoneNumber : body.phoneNumber, gender : body.gender, weight : body.weight, height : body.height, accountActivateCode})
        return true
    }

    async confirmEmail(body: any) {
        const user = await this.userModel.findOne({email : body.email})
        if(!user) throw new NotFoundException('Email not found')
        const checkCode = bcrypt.compareSync(body.activateCode , user.accountActivateCode)
        if(!checkCode) throw new BadRequestException("Invalid verification code")
        user.accountActivateCode = null
        user.isAccountActivated = true
        await user.save()
        const userToken = this.jwtService.sign({ id: user._id, name: user.firstName, email: user.email, role: "user" },
            { secret: process.env.JWT_SECRET_LOGIN, expiresIn: "90d" })
        return userToken
    }

    async resendCode(body: any) {
        const user = await this.userModel.findOne({email : body.email})
        if(!user) throw new NotFoundException('Email not found')
        if(user.isAccountActivated) throw new ConflictException('Account already activated')
        const activateCode = Math.floor(1000 + Math.random() * 9000).toString();
        const accountActivateCode = bcrypt.hashSync(activateCode, +process.env.SALT_ROUNDS)
        user.accountActivateCode = accountActivateCode
        await user.save()
        try{
            await this.sendEmailService.sendEmail(
                user.email,
                "Verification Code (valid right now for you)",
                `Hi ${user.firstName},\nYour verification code is ${activateCode}.
                \nEnter this code to access our [website] to activate your account.
                \nWe’re glad you’re here!`,
            )
        }
        catch{
            throw new InternalServerErrorException(`Email not sent, please try again`);
        }
        return true
        
    }

    async login(body: any) {
        const user = await this.userModel.findOne({email : body.email})
        if(!user) throw new BadRequestException('Invalid login credentials')
        if(!user.isAccountActivated) throw new ConflictException
            ('Account not activated, check your email for verification code to activate your account')
        const checkPassword = bcrypt.compareSync(body.password, user.password)
        if(!checkPassword) throw new BadRequestException('Invalid login credentials')
        const userToken = this.jwtService.sign({ id: user._id, name: user.firstName, email: user.email, role: "user" },
            { secret: process.env.JWT_SECRET_LOGIN, expiresIn: "90d" })
        return userToken
    }

    async forgotPassword(body: any) {
        const user = await this.userModel.findOne({email : body.email})
        if(!user) throw new NotFoundException('Email not found')
        if(user.passwordResetReq) throw new ConflictException('Password reset already requested')
        const resetPassCode = Math.floor(1000 + Math.random() * 9000).toString();
        const passwordResetCode = bcrypt.hashSync(resetPassCode, +process.env.SALT_ROUNDS)
        try{
            await this.sendEmailService.sendEmail(
                user.email,
                "Password Reset Code (valid right now for you)",
                `Hi ${user.firstName},\nThere was a request to change your password!\n
                If you did not make this request then please ignore this email.\n
                Otherwise, Please enter this code to change your password: ${resetPassCode}\n`,
            )
            user.passwordResetCode = passwordResetCode
            await user.save()
        }
        catch{
            user.passwordResetCode = null
            await user.save()
            throw new InternalServerErrorException(`Email not sent, please try again`);
        }
        return true
    }

    async verifyPasswordResetCode(body: any) {
        const user = await this.userModel.findOne({email : body.email})
        if(!user) throw new NotFoundException('Email not found')
        const checkCode = bcrypt.compareSync(body.resetCode , user.passwordResetCode)
        // check if otp is valid
        if(!checkCode) throw new BadRequestException("Invalid verification code")
        user.passwordResetReq = true
        await user.save()
        return true
    }

    async resetPassword(body: any) {
        const user = await this.userModel.findOne({email : body.email})
        if(!user) throw new NotFoundException('Email not found')
        const hashPassword = bcrypt.hashSync(body.password, +process.env.SALT_ROUNDS)
        user.password = hashPassword
        user.passwordResetCode = null
        user.passwordResetReq = false
        await user.save()
        const userToken = this.jwtService.sign({ id: user._id, name: user.firstName, email: user.email, role: "user" },
            { secret: process.env.JWT_SECRET_LOGIN, expiresIn: "90d" })
        return userToken
    }

}