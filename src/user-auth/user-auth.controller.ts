import { Body, Controller, Patch, Post, Res, UsePipes } from '@nestjs/common';
import { UserAuthService } from './user-auth.service';
import { Response } from 'express';
import { ZodValidationPipe } from 'src/pipes/validation.pipe';
import { UserAuthZodSchema } from './user-auth.zod-schema';


@Controller('userAuth')
export class UserAuthController {
    constructor(
        private readonly userAuthService: UserAuthService
    ) {}

    @Post('signup')
    @UsePipes(new ZodValidationPipe(UserAuthZodSchema.signUpSchema))
    async signUp(
        @Body()body: any,
        @Res() res: Response
    ) {
        await this.userAuthService.signUp(body)
        res.status(201).json({
            message: 'Account created successfully, check your email for verification code',
            statusCode: 201
        })
    }

    @Post('verifyemail')
    @UsePipes(new ZodValidationPipe(UserAuthZodSchema.confirmEmailSchema))
    async confirmEmail(
        @Body()body: any,
        @Res() res: Response
    ) {
        const userToken = await this.userAuthService.confirmEmail(body)
        res.status(200).json({
            message: 'Account activated successfully',
            statusCode: 200,
            userToken
        })
    }

    @Post('resendcode')
    @UsePipes(new ZodValidationPipe(UserAuthZodSchema.resendCode))
    async resendCode(
        @Body()body: any,
        @Res() res: Response
    ) {
        await this.userAuthService.resendCode(body)
        res.status(200).json({
            message: 'Verification code sent successfully, check your email for verification code',
            statusCode: 200
        })
    }

    @Post('login')
    @UsePipes(new ZodValidationPipe(UserAuthZodSchema.loginSchema))
    async login(
        @Body()body: any,
        @Res() res: Response
    ) {
        const userToken = await this.userAuthService.login(body)
        res.status(200).json({
            message: 'Logged in successfully',
            statusCode: 200,
            userToken
        })
    }

    @Post('forgetpassword')
    @UsePipes(new ZodValidationPipe(UserAuthZodSchema.resendCode))
    async forgotPasswordReq(
        @Body()body: any,
        @Res() res: Response
    ) {
        await this.userAuthService.forgotPassword(body)
        res.status(200).json({
            message: 'Password reset code sent successfully, check your email for reset your password',
            statusCode: 200
        })
    }

    @Post('verifycode')
    @UsePipes(new ZodValidationPipe(UserAuthZodSchema.verifyPasswordResetCode))
    async verifyPasswordResetCode(
        @Body()body: any,
        @Res() res: Response
    ) {
        await this.userAuthService.verifyPasswordResetCode(body)
        res.status(200).json({
            message: 'Code verified successfully, enter new password',
            statusCode: 200
        })
    }

    @Patch('resetpassword')
    @UsePipes(new ZodValidationPipe(UserAuthZodSchema.resetPassword))
    async resetPassword(
        @Body()body: any,
        @Res() res: Response
    ) {
        const token = await this.userAuthService.resetPassword(body)
        res.status(200).json({
            message: 'Password changed successfully',
            statusCode: 200,
            token
        })
    }

}