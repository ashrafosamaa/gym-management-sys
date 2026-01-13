import { Body, Controller, Delete, Get, Param, Put, Query, Req, Res, UsePipes, UseGuards, Post } from '@nestjs/common';
import { Request, Response } from 'express';
import { ZodValidationPipe } from '../pipes/validation.pipe';
import { MembershipZodSchema } from './membership.zod-schema';
import { AuthAdminGuard, AuthUserGuard } from '../guards';
import { MembershipService } from './membership.service';


@Controller('membership')
export class MembershipController {
    constructor(
        private readonly membershipService: MembershipService
    ) {}

    @Post()
    @UsePipes(new ZodValidationPipe(MembershipZodSchema.addMembershipByAdminSchema))
    @UseGuards(AuthAdminGuard)
    async addMembershipByAdmin(
        @Body() body: any,
        @Res() res: Response
    ) {
        await this.membershipService.addMembershipByAdmin(body)
        res.status(201).json({
            message: 'Membership added successfully',
            statusCode: 201
        })
    }

    @Get()
    @UsePipes(new ZodValidationPipe(MembershipZodSchema.getAllSchema))
    @UseGuards(AuthAdminGuard)
    async getAllMemberships(
        @Query() query: any ,
        @Res() res: Response
    ) {
        const memberships = await this.membershipService.getAllMemberships(query)
        res.status(200).json({
            message: 'Memberships fetched successfully',
            statusCode: 200,
            memberships
        })
    }

    @Get('byId/:membershipId')
    @UsePipes(new ZodValidationPipe(MembershipZodSchema.IDSchema))
    @UseGuards(AuthAdminGuard)
    async getMembership(
        @Param() params: any,
        @Res() res: Response
    ) {
        const membership = await this.membershipService.getMembership(params)
        res.status(200).json({
            message: 'Membership fetched successfully',
            statusCode: 200,
            membership
        })
    }

    @Get('user/:userId')
    @UsePipes(new ZodValidationPipe(MembershipZodSchema.userIDSchema))
    @UseGuards(AuthAdminGuard)
    async getAllMembershipsForUser(
        @Param() params: any,
        @Res() res: Response
    ) {
        const memberships = await this.membershipService.getAllMembershipsForUser(params)
        res.status(200).json({
            message: 'Memberships fetched successfully',
            statusCode: 200,
            memberships
        })
    }

    @Get('branch/:branchId')
    @UsePipes(new ZodValidationPipe(MembershipZodSchema.branchIDSchema))
    @UseGuards(AuthAdminGuard)
    async getAllMembershipsForBranch(
        @Param() params: any,
        @Res() res: Response
    ) {
        const memberships = await this.membershipService.getAllMembershipsForBranch(params)
        res.status(200).json({
            message: 'Memberships fetched successfully',
            statusCode: 200,
            memberships
        })
    }

    @Put('byId/:membershipId')
    @UseGuards(AuthAdminGuard)
    async updateMembershipByAdmin(
        @Param(new ZodValidationPipe(MembershipZodSchema.IDSchema)) params: any,
        @Body(new ZodValidationPipe(MembershipZodSchema.updateMembershipByAdminSchema)) body: any,
        @Res() res: Response
    ) {
        await this.membershipService.updateMembershipByAdmin(body, params)
        res.status(200).json({
            message: 'Membership updated successfully',
            statusCode: 200,
        })
    }

    @Delete('byId/:membershipId')
    @UsePipes(new ZodValidationPipe(MembershipZodSchema.IDSchema))
    @UseGuards(AuthAdminGuard)
    async deleteMembershipByAdmin(
        @Param() params: any,
        @Res() res: Response
    ) {
        await this.membershipService.deleteMembershipByAdmin(params)
        res.status(200).json({
            message: 'Membership deleted successfully',
            statusCode: 200,
        })
    }

    // user

    @Post('mine')
    @UsePipes(new ZodValidationPipe(MembershipZodSchema.addMembershipSchema))
    @UseGuards(AuthUserGuard)
    async addMembership(
        @Body() body: any,
        @Req() req: Request,
        @Res() res: Response
    ) {
        await this.membershipService.addMembership(body, req)
        res.status(201).json({
            message: 'Membership added successfully',
            statusCode: 201
        })
    }

    @Get('mine/all')
    @UsePipes(new ZodValidationPipe(MembershipZodSchema.noSchema))
    @UseGuards(AuthUserGuard)
    async getAllMyMemberships(
        @Req() req: Request,
        @Res() res: Response
    ) {
        const memberships = await this.membershipService.getAllMyMemberships(req)
        res.status(200).json({
            message: 'Memberships fetched successfully',
            statusCode: 200,
            memberships
        })
    }

    @Get('mine/byId/:membershipId')
    @UsePipes(new ZodValidationPipe(MembershipZodSchema.IDSchema))
    @UseGuards(AuthUserGuard)
    async getMyMembership(
        @Param() params: any,
        @Req() req: Request,
        @Res() res: Response
    ) {
        const membership = await this.membershipService.getMyMembership(params, req)
        res.status(200).json({
            message: 'Membership fetched successfully',
            statusCode: 200,
            membership
        })
    }

    @Put('mine/byId/:membershipId')
    @UseGuards(AuthUserGuard)
    async updateMyMembership(
        @Param(new ZodValidationPipe(MembershipZodSchema.IDSchema)) params: any,
        @Body(new ZodValidationPipe(MembershipZodSchema.updateMyMembershipSchema)) body: any,
        @Req() req: Request,
        @Res() res: Response
    ) {
        await this.membershipService.updateMyMembership(body, req, params)
        res.status(200).json({
            message: 'Membership updated successfully',
            statusCode: 200,
        })
    }

    @Delete('mine/byId/:membershipId')
    @UsePipes(new ZodValidationPipe(MembershipZodSchema.IDSchema))
    @UseGuards(AuthUserGuard)
    async deleteMyMembership(
        @Param() params: any,
        @Req() req: Request,
        @Res() res: Response
    ) {
        await this.membershipService.deleteMyMembership(req, params)
        res.status(200).json({
            message: 'Membership deleted successfully',
            statusCode: 200,
        })
    }

}