import { Body, Controller, Delete, Get, Patch, Post, Param, Req, Res, UseGuards, UsePipes } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Request, Response } from 'express';
import { ZodValidationPipe } from 'src/pipes/validation.pipe';
import { createAdminSchema, IDSchema, loginAdminSchema, updateMyPasswordSchema } from './admin.zod-schema';
import { AuthAdminGuard } from 'src/guards';


@Controller('admin')
export class AdminController {
    constructor(
        private readonly adminService: AdminService
    ) {}

    @Post()
    @UsePipes(new ZodValidationPipe(createAdminSchema))
    @UseGuards(AuthAdminGuard)
    async createAdmin(
        @Body() body: any,
        @Req() req: Request,
        @Res() res: Response
    ) {
        await this.adminService.createAdmin(body, req)
        res.status(201).json({
            message: 'Admin created successfully',
            statusCode: 201
        })
    }

    @Post('login')
    @UsePipes(new ZodValidationPipe(loginAdminSchema))
    async login(
        @Body() body: any,
        @Res() res: Response
    ) {
        const token = await this.adminService.login(body)
        res.status(200).json({
            message: 'Admin logged in successfully',
            statusCode: 200,
            token
        })
    }

    @Get('byId/:adminId')
    async getAdmin(
        @Req() req: Request,
        @Res() res: Response
    ) {
        const admin = await this.adminService.getAdmin(req)
        res.status(200).json({
            message: 'Admin account fetched successfully',
            statusCode: 200,
            admin
        })
    }

    @Get()
    async getAllAdmins(
        @Req() req: Request,
        @Res() res: Response
    ) {
        const admins = await this.adminService.getAllAdmins(req)
        res.status(200).json({
            message: 'Admin accounts fetched successfully',
            statusCode: 200,
            admins
        })
    }

    @Patch()
    @UsePipes(new ZodValidationPipe(updateMyPasswordSchema))
    @UseGuards(AuthAdminGuard)
    async updateMyAccount(
        @Req() req: Request,
        @Res() res: Response,
        @Body() body: any,
    ) {
        await this.adminService.updateMyPassword(body, req)
        res.status(200).json({
            message: 'Your password updated successfully',
            statusCode: 200,
        })
    }

    @Delete('/:adminId')
    @UsePipes(new ZodValidationPipe(IDSchema))
    @UseGuards(AuthAdminGuard)
    async deleteAdmin(
        @Req() req: Request,
        @Param() param: any,
        @Res() res: Response
    ) {
        await this.adminService.deleteAdmin(req, param)
        res.status(200).json({
            message: 'Your account deleted successfully',
            statusCode: 200
        })
    }

}
