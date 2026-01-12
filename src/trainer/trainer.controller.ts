import { Body, Controller, Delete, Get, Param, Patch, Put, Query, Req, Res, 
    UsePipes, UseInterceptors, UseGuards, Post, UploadedFile} from '@nestjs/common';
import { TrainerService } from './trainer.service';
import { Request, Response } from 'express';
import { ZodValidationPipe } from '../pipes/validation.pipe';
import { UserZodSchema } from './trainer.zod-schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthAdminGuard, AuthTrainerGuard, multerImages } from '../guards';
import * as Multer from "multer";



@Controller('trainer')
export class TrainerController {
    constructor(
        private readonly trainerService: TrainerService
    ) {}

    @Post()
    @UsePipes(new ZodValidationPipe(UserZodSchema.addTrainerSchema))
    @UseGuards(AuthAdminGuard)
    async addTrainer(
        @Body() body: any ,
        @Res() res: Response
    ) {
        await this.trainerService.addTrainer(body)
        res.status(201).json({
            message: 'Trainer added successfully',
            statusCode: 201
        })
    }

    @Get()
    @UsePipes(new ZodValidationPipe(UserZodSchema.getAllSchema))
    async getAllTrainers(
        @Query() query: any ,
        @Res() res: Response
    ) {
        const trainers = await this.trainerService.getAllTrainers(query)
        res.status(200).json({
            message: 'Trainers fetched successfully',
            statusCode: 200,
            trainers
        })
    }

    @Get('branch/:branchId')
    @UsePipes(new ZodValidationPipe(UserZodSchema.branchIdSchema))
    async getTrainersByBranchId(
        @Param() params: any ,
        @Res() res: Response
    ) {
        const trainers = await this.trainerService.getTrainersByBranchId(params)
        res.status(200).json({
            message: 'Trainers fetched successfully',
            statusCode: 200,
            trainers
        })
    }

    @Get('byId/:trainerId')
    @UsePipes(new ZodValidationPipe(UserZodSchema.IDSchema))
    async getTrainer(
        @Param() params: any,
        @Res() res: Response
    ) {
        const trainer = await this.trainerService.getTrainer(params)
        res.status(200).json({
            message: 'Trainer fetched successfully',
            statusCode: 200,
            trainer
        })
    }

    @Get('search')
    @UsePipes(new ZodValidationPipe(UserZodSchema.searchSchema))
    async searchTrainers(
        @Query() query: any,
        @Res() res: Response
    ) {
        const trainers = await this.trainerService.searchTrainers(query)
        res.status(200).json({
            message: 'Trainers fetched successfully',
            statusCode: 200,
            trainers
        })
    }

    @Put('byId/:trainerId')
    @UseGuards(AuthAdminGuard)
    async updateTrainerAcc(
        @Param(new ZodValidationPipe(UserZodSchema.IDSchema)) params: any,
        @Body(new ZodValidationPipe(UserZodSchema.updateTrainerAccSchema)) body: any,
        @Res() res: Response
    ) {
        await this.trainerService.updateTrainerAcc(body, params)
        res.status(200).json({
            message: 'Trainer account updated successfully',
            statusCode: 200,
        })
    }

    @Delete('byId/:trainerId')
    @UsePipes(new ZodValidationPipe(UserZodSchema.IDSchema))
    @UseGuards(AuthAdminGuard)
    async deleteTrainerAcc(
        @Param() params: any,
        @Res() res: Response
    ) {
        await this.trainerService.deleteTrainerAcc(params)
        res.status(200).json({
            message: 'Trainer account deleted successfully',
            statusCode: 200,
        })
    }

    @Post('first')
    @UsePipes(new ZodValidationPipe(UserZodSchema.firstLoginSchema))
    async firstLogin(
        @Body()body: any,
        @Res() res: Response
    ) {
        await this.trainerService.firstLogin(body)
        res.status(200).json({
            message: 'Trainer Password updated successfully, Now you can login',
            statusCode: 200,
        })
    }

    @Post('signIn')
    @UsePipes(new ZodValidationPipe(UserZodSchema.signInSchema))
    async signIn(
        @Body()body: any,
        @Res() res: Response
    ) {
        const trainerToken = await this.trainerService.signIn(body)
        res.status(200).json({
            message: 'Logged in successfully',
            statusCode: 200,
            trainerToken
        })
    }

    @Get('myAcc')
    @UsePipes(new ZodValidationPipe(UserZodSchema.noSchema))
    @UseGuards(AuthTrainerGuard)
    async getMyAcc(
        @Req() req: Request,
        @Res() res: Response
    ) {
        const trainer = await this.trainerService.getMyAcc(req)
        res.status(200).json({
            message: 'Account fetched successfully',
            statusCode: 200,
            trainer
        })
    }

    @Put('myAcc')
    @UsePipes(new ZodValidationPipe(UserZodSchema.updateMyAccSchema))
    @UseGuards(AuthTrainerGuard)
    async updateMyAcc(
        @Body() body: any,
        @Req() req: Request,
        @Res() res: Response
    ) {
        await this.trainerService.updateMyAcc(body, req)
        res.status(200).json({
            message: 'Account updated successfully',
            statusCode: 200,
        })
    }

    @Patch('password')
    @UsePipes(new ZodValidationPipe(UserZodSchema.updatePasswordSchema))
    @UseGuards(AuthTrainerGuard)
    async updateMyPassword(
        @Body() body: any,
        @Req() req: Request,
        @Res() res: Response
    ) {
        const trainerToken = await this.trainerService.updateMyPassword(body, req)
        res.status(200).json({
            message: 'Password updated successfully',
            statusCode: 200,
            trainerToken
        })
    }

    @Delete('myAcc')
    @UsePipes(new ZodValidationPipe(UserZodSchema.noSchema))
    @UseGuards(AuthTrainerGuard)
    async deleteMyAcc(
        @Req() req: Request,
        @Res() res: Response
    ) {
        await this.trainerService.deleteMyAcc(req)
        res.status(200).json({
            message: 'Account deleted successfully',
            statusCode: 200,
        })
    }

    @Post('myAcc/pic')
    @UseInterceptors(FileInterceptor('Img', multerImages))
    @UseGuards(AuthTrainerGuard)
    async addProfilePicture(
        @UploadedFile() file: Multer.File,
        @Req() req: Request,
        @Res() res: Response
    ) {
        await this.trainerService.addProfilePicture(file, req)
        res.status(200).json({
            message: 'Profile picture added successfully',
            statusCode: 200,
        })
    }

    @Put('myAcc/pic')
    @UseInterceptors(FileInterceptor('Img', multerImages))
    @UseGuards(AuthTrainerGuard)
    async updateProfilePicture(
        @UploadedFile() file: Multer.File,
        @Body(new ZodValidationPipe(UserZodSchema.updateProfilePicSchema)) body: any,
        @Req() req: Request,
        @Res() res: Response
    ) {
        await this.trainerService.updateProfilePicture(req, file, body)
        res.status(200).json({
            message: 'Profile picture updated successfully',
            statusCode: 200,
        })
    }

    // forget password

    @Post('forgotPassword')
    @UsePipes(new ZodValidationPipe(UserZodSchema.forgotPasswordSchema))
    async passwordForgetRequest(
        @Body()body: any,
        @Res() res: Response
    ) {
        await this.trainerService.passwordForgetRequest(body)
        res.status(200).json({
            message: 'Password reset request sent successfully, call admin to reset your password',
            statusCode: 200
        })
    }

    @Get('passReq')
    @UsePipes(new ZodValidationPipe(UserZodSchema.noSchema))
    @UseGuards(AuthAdminGuard)
    async getTrainersByPassReq(
        @Res() res: Response
    ) {
        const trainers = await this.trainerService.getTrainersByPassReq()
        res.status(200).json({
            message: 'Trainers fetched successfully',
            statusCode: 200,
            trainers
        })
    }

    @Patch('byId/:trainerId')
    @UseGuards(AuthAdminGuard)
    async updateTrainerPass(
        @Param(new ZodValidationPipe(UserZodSchema.IDSchema)) params: any,
        @Res() res: Response
    ) {
        await this.trainerService.updateTrainerPass(params)
        res.status(200).json({
            message: 'Trainer password updated successfully',
            statusCode: 200,
        })
    }

}