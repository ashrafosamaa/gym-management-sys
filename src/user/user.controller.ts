import { Body, Controller, Delete, Get, Param, Patch, Put, Query, Req, Res, 
    UsePipes, UseInterceptors, UseGuards, Post, 
    UploadedFile} from '@nestjs/common';
import { UserService } from './user.service';
import { Request, Response } from 'express';
import { ZodValidationPipe } from '../pipes/validation.pipe';
import { UserZodSchema } from './user.zod-schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthAdminGuard, AuthUserGuard, multerImages } from '../guards';
import * as Multer from "multer";



@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) {}

    @Get()
    @UsePipes(new ZodValidationPipe(UserZodSchema.getAllSchema))
    @UseGuards(AuthAdminGuard)
    async getAllUsers(
        @Query() query: any ,
        @Res() res: Response
    ) {
        const users = await this.userService.getAllUsers(query)
        res.status(200).json({
            message: 'Users fetched successfully',
            statusCode: 200,
            users
        })
    }

    @Get('byId/:userId')
    @UsePipes(new ZodValidationPipe(UserZodSchema.IDSchema))
    @UseGuards(AuthAdminGuard)
    async getUser(
        @Param() params: any,
        @Res() res: Response
    ) {
        const user = await this.userService.getUser(params)
        res.status(200).json({
            message: 'User fetched successfully',
            statusCode: 200,
            user
        })
    }

    @Get('search')
    @UsePipes(new ZodValidationPipe(UserZodSchema.searchSchema))
    @UseGuards(AuthAdminGuard)
    async searchUsers(
        @Query() query: any,
        @Res() res: Response
    ) {
        const users = await this.userService.searchUsers(query)
        res.status(200).json({
            message: 'Users fetched successfully',
            statusCode: 200,
            users
        })
    }

    @Put('byId/:userId')
    @UseGuards(AuthAdminGuard)
    async updateUserAcc(
        @Param(new ZodValidationPipe(UserZodSchema.IDSchema)) params: any,
        @Body(new ZodValidationPipe(UserZodSchema.updateUserAccSchema)) body: any,
        @Res() res: Response
    ) {
        await this.userService.updateUserAcc(body, params)
        res.status(200).json({
            message: 'User account updated successfully',
            statusCode: 200,
        })
    }

    @Delete('byId/:userId')
    @UsePipes(new ZodValidationPipe(UserZodSchema.IDSchema))
    @UseGuards(AuthAdminGuard)
    async deleteUserAcc(
        @Param() params: any,
        @Res() res: Response
    ) {
        await this.userService.deleteUserAcc(params)
        res.status(200).json({
            message: 'User account deleted successfully',
            statusCode: 200,
        })
    }

    @Get('myAcc')
    @UsePipes(new ZodValidationPipe(UserZodSchema.noSchema))
    @UseGuards(AuthUserGuard)
    async getMyAcc(
        @Req() req: Request,
        @Res() res: Response
    ) {
        const user = await this.userService.getMyAcc(req)
        res.status(200).json({
            message: 'Account fetched successfully',
            statusCode: 200,
            user
        })
    }

    @Put('myAcc')
    @UsePipes(new ZodValidationPipe(UserZodSchema.updateMyAccSchema))
    @UseGuards(AuthUserGuard)
    async updateMyAcc(
        @Body() body: any,
        @Req() req: Request,
        @Res() res: Response
    ) {
        await this.userService.updateMyAcc(body, req)
        res.status(200).json({
            message: 'Account updated successfully',
            statusCode: 200,
        })
    }

    @Patch('password')
    @UsePipes(new ZodValidationPipe(UserZodSchema.updatePasswordSchema))
    @UseGuards(AuthUserGuard)
    async updateMyPassword(
        @Body() body: any,
        @Req() req: Request,
        @Res() res: Response
    ) {
        const token = await this.userService.updateMyPassword(body, req)
        res.status(200).json({
            message: 'Password updated successfully',
            statusCode: 200,
            token
        })
    }

    @Delete('myAcc')
    @UsePipes(new ZodValidationPipe(UserZodSchema.noSchema))
    @UseGuards(AuthUserGuard)
    async deleteMyAcc(
        @Req() req: Request,
        @Res() res: Response
    ) {
        await this.userService.deleteMyAcc(req)
        res.status(200).json({
            message: 'Account deleted successfully',
            statusCode: 200,
        })
    }

    @Post('myAcc/pic')
    @UseInterceptors(FileInterceptor('Img', multerImages))
    @UseGuards(AuthUserGuard)
    async addProfilePicture(
        @UploadedFile() file: Multer.File,
        @Req() req: Request,
        @Res() res: Response
    ) {
        await this.userService.addProfilePicture(file, req)
        res.status(200).json({
            message: 'Profile picture added successfully',
            statusCode: 200,
        })
    }

    @Put('myAcc/pic')
    @UseInterceptors(FileInterceptor('Img', multerImages))
    @UseGuards(AuthUserGuard)
    async updateProfilePicture(
        @UploadedFile() file: Multer.File,
        @Body(new ZodValidationPipe(UserZodSchema.updateProfilePicSchema)) body: any,
        @Req() req: Request,
        @Res() res: Response
    ) {
        await this.userService.updateProfilePicture(req, file, body)
        res.status(200).json({
            message: 'Profile picture updated successfully',
            statusCode: 200,
        })
    }
        
}