import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Branch } from '../DB/models/branch.model';
import { Trainer } from 'src/DB/models/trainer.model';
import { Membership } from 'src/DB/models/membership.model';
import { Sub } from 'src/DB/models/subscription.model';


@Injectable()
export class BranchService {
    constructor(
        @InjectModel(Branch.name) private branchModel : Model<Branch>,
        @InjectModel(Trainer.name) private trainerModel : Model<Trainer>,
        @InjectModel(Membership.name) private membershipModel : Model<Membership>,
        @InjectModel(Sub.name) private subModel : Model<Sub>,
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
        if (body.isActive !== undefined){
            const isSubExist = await this.subModel.find({ branchId: params.branchId, isActive: true });
            const isMembershipExist = await this.membershipModel.find({ branchId: params.branchId, isActive: true });
            if (isSubExist.length || isMembershipExist.length) throw new ConflictException
                ('Branch has Active subscriptions, memberships you cannot change its status')
            const isTrainerExist = await this.trainerModel.find({ branchId: params.branchId });
            for (let i = 0; i < isTrainerExist.length; i++) {
                isTrainerExist[i].isActive = body.isActive;
                await isTrainerExist[i].save();
            }
            branch.isActive = body.isActive
        }
        await branch.save();
        return true;
    }

    async deleteBranch(params: any) {
        const branch = await this.branchModel.findByIdAndDelete(params.branchId);
        const isMembershipExist = await this.membershipModel.find({ branchId: params.branchId });
        const isSubExist = await this.subModel.find({ branchId: params.branchId });
        if (isMembershipExist.length || isSubExist.length) throw new ConflictException
            ('Branch has Active subscriptions, memberships you cannot delete it')
        if (!branch) throw new NotFoundException('Branch not found');
        return true;
    }

}