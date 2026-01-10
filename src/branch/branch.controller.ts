import { Body, Controller, Delete, Get, Param, Post, Put, Res, UseGuards, UsePipes } from '@nestjs/common';
import { BranchService } from './branch.service';
import { Response } from 'express';
import { ZodValidationPipe } from 'src/pipes/validation.pipe';
import { BranchZodSchema } from './branch.zod-schema';
import { AuthAdminGuard } from '../guards';

@Controller('branch')
export class BranchController {
    constructor(
        private readonly branchService: BranchService
    ) {}

    @Post()
    @UsePipes(new ZodValidationPipe(BranchZodSchema.addBranchSchema))
    @UseGuards(AuthAdminGuard)
    async addBranch(
        @Body() body: any,
        @Res() res: Response
    ) {
        await this.branchService.addBranch(body);
        res.status(201).json({
            message : 'Branch created successfully',
            statusCode : 201
        })
    }

    @Get()
    @UsePipes(new ZodValidationPipe(BranchZodSchema.NoSchema))
    async getAllBranches(
        @Res() res: Response
    ) {
        const branches = await this.branchService.getAllBranches();
        res.status(200).json({
            message : 'Branches fetched successfully',
            statusCode : 200,
            branches
        })
    }

    @Get('byId/:branchId')
    @UsePipes(new ZodValidationPipe(BranchZodSchema.IDSchema))
    async getBranchById(
        @Res() res: Response,
        @Param() params: any
    ) {
        const branch = await this.branchService.getBranchById(params);
        res.status(200).json({
            message : 'Branch fetched successfully',
            statusCode : 200,
            branch
        })
    }

    @Put('byId/:branchId')
    @UseGuards(AuthAdminGuard)
    async updateBranch(
        @Param(new ZodValidationPipe(BranchZodSchema.IDSchema)) params: any,
        @Body(new ZodValidationPipe(BranchZodSchema.updateBranchSchema)) body: any,
        @Res() res: Response,
    ) {
        await this.branchService.updateBranch(params, body);
        res.status(200).json({
            message : 'Branch updated successfully',
            statusCode : 200
        })
    }

    @Delete('byId/:branchId')
    @UseGuards(AuthAdminGuard)
    async deleteBranch(
        @Param(new ZodValidationPipe(BranchZodSchema.IDSchema)) params: any,
        @Res() res: Response,
    ) {
        await this.branchService.deleteBranch(params);
        res.status(200).json({
            message : 'Branch deleted successfully',
            statusCode : 200
        })
    }
}