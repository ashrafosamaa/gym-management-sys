import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Branch } from '../DB/models/branch.model';


@Injectable()
export class BranchService {
    constructor(
        @InjectModel(Branch.name) private branchModel : Model<Branch>,
    ) {}

    async addBranch(body: any) {
        await this.branchModel.create({
            name: body.name,
            description: body.description,
            address: body.address,
            isActive: body.isActive
        })
        return true
    }

    async getAllBranches() {
        const branches = await this.branchModel.find().select('name address isActive');
        if(branches.length == 0) throw new NotFoundException('No branches found');
        return branches
    }

    async getBranchById(params: any) {
        const branch = await this.branchModel.findById(params.branchId).select('name description address isActive');
        if (!branch) throw new NotFoundException('Branch not found');
        return branch;
    }

    async updateBranch(params: any, body: any) {
        const branch = await this.branchModel.findById(params.branchId);
        if (!branch) throw new NotFoundException('Branch not found');
        if (body.name) branch.name = body.name;
        if (body.description) branch.description = body.description;
        if (body.address) branch.address = body.address;
        if (body.isActive) branch.isActive = body.isActive;
        await branch.save();
        return true;
    }

    async deleteBranch(params: any) {
        const branch = await this.branchModel.findByIdAndDelete(params.branchId);
        if (!branch) throw new NotFoundException('Branch not found');
        return true;
    }

}