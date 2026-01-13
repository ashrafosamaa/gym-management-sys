import { Body, Controller, Delete, Get, Param, Put, Query, Req, Res, UsePipes, UseGuards, Post } from '@nestjs/common';
import { Request, Response } from 'express';
import { ZodValidationPipe } from '../pipes/validation.pipe';
import { SubZodSchema } from './subscription.zod-schema';
import { AuthAdminGuard, AuthUserGuard } from '../guards';
import { SubService } from './subscription.service';


@Controller('sub')
export class SubController {
    constructor(
        private readonly subService: SubService
    ) {}

    @Post()
    @UsePipes(new ZodValidationPipe(SubZodSchema.addSubByAdminSchema))
    @UseGuards(AuthAdminGuard)
    async addSubByAdmin(
        @Body() body: any,
        @Res() res: Response
    ) {
        await this.subService.addSubByAdmin(body)
        res.status(201).json({
            message: 'Subscription added successfully',
            statusCode: 201
        })
    }

    @Get()
    @UsePipes(new ZodValidationPipe(SubZodSchema.getAllSchema))
    @UseGuards(AuthAdminGuard)
    async getAllSubs(
        @Query() query: any ,
        @Res() res: Response
    ) {
        const subs = await this.subService.getAllSubs(query)
        res.status(200).json({
            message: 'Subscriptions fetched successfully',
            statusCode: 200,
            subs
        })
    }

    @Get('byId/:subId')
    @UsePipes(new ZodValidationPipe(SubZodSchema.IDSchema))
    @UseGuards(AuthAdminGuard)
    async getSub(
        @Param() params: any,
        @Res() res: Response
    ) {
        const sub = await this.subService.getSub(params)
        res.status(200).json({
            message: 'Subscription fetched successfully',
            statusCode: 200,
            sub
        })
    }

    @Get('user/:userId')
    @UsePipes(new ZodValidationPipe(SubZodSchema.userIDSchema))
    @UseGuards(AuthAdminGuard)
    async getAllSubsForUser(
        @Param() params: any,
        @Res() res: Response
    ) {
        const subs = await this.subService.getAllSubsForUser(params)
        res.status(200).json({
            message: 'Subscriptions fetched successfully',
            statusCode: 200,
            subs
        })
    }

    @Get('branch/:branchId')
    @UsePipes(new ZodValidationPipe(SubZodSchema.branchIDSchema))
    @UseGuards(AuthAdminGuard)
    async getAllSubsForBranch(
        @Param() params: any,
        @Res() res: Response
    ) {
        const subs = await this.subService.getAllSubsForBranch(params)
        res.status(200).json({
            message: 'Subscriptions fetched successfully',
            statusCode: 200,
            subs
        })
    }

    @Get('trainer/:trainerId')
    @UsePipes(new ZodValidationPipe(SubZodSchema.trainerIDSchema))
    @UseGuards(AuthAdminGuard)
    async getAllSubsForTrainer(
        @Param() params: any,
        @Res() res: Response
    ) {
        const subs = await this.subService.getAllSubsForTrainer(params)
        res.status(200).json({
            message: 'Subscriptions fetched successfully',
            statusCode: 200,
            subs
        })
    }

    @Put('byId/:subId')
    @UseGuards(AuthAdminGuard)
    async updateSubByAdmin(
        @Param(new ZodValidationPipe(SubZodSchema.IDSchema)) params: any,
        @Body(new ZodValidationPipe(SubZodSchema.updateSubByAdminSchema)) body: any,
        @Res() res: Response
    ) {
        await this.subService.updateSubByAdmin(body, params)
        res.status(200).json({
            message: 'Subscription updated successfully',
            statusCode: 200,
        })
    }

    @Delete('byId/:subId')
    @UsePipes(new ZodValidationPipe(SubZodSchema.IDSchema))
    @UseGuards(AuthAdminGuard)
    async deleteSubByAdmin(
        @Param() params: any,
        @Res() res: Response
    ) {
        await this.subService.deleteSubByAdmin(params)
        res.status(200).json({
            message: 'Subscription deleted successfully',
            statusCode: 200,
        })
    }

    // user

    @Post('mine')
    @UsePipes(new ZodValidationPipe(SubZodSchema.addSubSchema))
    @UseGuards(AuthUserGuard)
    async addSub(
        @Body() body: any,
        @Req() req: Request,
        @Res() res: Response
    ) {
        await this.subService.addSub(body, req)
        res.status(201).json({
            message: 'Subscription added successfully',
            statusCode: 201
        })
    }

    @Get('mine/all')
    @UsePipes(new ZodValidationPipe(SubZodSchema.noSchema))
    @UseGuards(AuthUserGuard)
    async getAllMySubs(
        @Req() req: Request,
        @Res() res: Response
    ) {
        const subs = await this.subService.getAllMySubs(req)
        res.status(200).json({
            message: 'Subscriptions fetched successfully',
            statusCode: 200,
            subs
        })
    }

    @Get('mine/byId/:subId')
    @UsePipes(new ZodValidationPipe(SubZodSchema.IDSchema))
    @UseGuards(AuthUserGuard)
    async getMySub(
        @Param() params: any,
        @Req() req: Request,
        @Res() res: Response
    ) {
        const sub = await this.subService.getMySub(params, req)
        res.status(200).json({
            message: 'Subscription fetched successfully',
            statusCode: 200,
            sub
        })
    }

    @Put('mine/byId/:subId')
    @UseGuards(AuthUserGuard)
    async updateMySub(
        @Param(new ZodValidationPipe(SubZodSchema.IDSchema)) params: any,
        @Body(new ZodValidationPipe(SubZodSchema.updateMySubSchema)) body: any,
        @Req() req: Request,
        @Res() res: Response
    ) {
        await this.subService.updateMySub(body, req, params)
        res.status(200).json({
            message: 'Subscription updated successfully',
            statusCode: 200,
        })
    }

    @Put('comment/byId/:subId')
    @UseGuards(AuthUserGuard)
    async addCommentAndRate(
        @Param(new ZodValidationPipe(SubZodSchema.IDSchema)) params: any,
        @Body(new ZodValidationPipe(SubZodSchema.addCommentAndRateSchema)) body: any,
        @Req() req: Request,
        @Res() res: Response
    ) {
        await this.subService.addCommentAndRate(body, req, params)
        res.status(200).json({
            message: 'Comment, rate added successfully',
            statusCode: 200,
        })
    }

    @Delete('mine/byId/:membershipId')
    @UsePipes(new ZodValidationPipe(SubZodSchema.IDSchema))
    @UseGuards(AuthUserGuard)
    async deleteMySub(
        @Param() params: any,
        @Req() req: Request,
        @Res() res: Response
    ) {
        await this.subService.deleteMySub(req, params)
        res.status(200).json({
            message: 'Membership deleted successfully',
            statusCode: 200,
        })
    }

}