import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { Membership } from '../DB/models/membership.model';
import { User } from '../DB/models/user.model';
import { APIFeatures } from '../utils/api-feature';
import { Branch } from 'src/DB/models/branch.model';


@Injectable()
export class MembershipService {
    constructor(
        @InjectModel(Membership.name) private membershipModel: Model<Membership>,
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Branch.name) private branchModel: Model<Branch>,
        private jwtService: JwtService
    ) {}

    async addMembershipByAdmin(body: any) {
        const user = await this.userModel.findOne({ phoneNumber: body.phoneNumber }).select('_id')
        if(!user) throw new NotFoundException('User not found')
        //check branch id
        const branch = await this.branchModel.findById(body.branchId)
        if(!branch || !branch.isActive) throw new NotFoundException('Branch not found')
        // set price & time
        const priceMap = { 1: 400, 3: 950, 6: 1800, 12: 3600 };
        const price = priceMap[body.duration];
        const endDate = new Date(body.startDate)
        endDate.setMonth(endDate.getMonth() + body.duration)
        await this.membershipModel.create({ duration: body.duration, startDate: body.startDate, endDate, price,
            userId: user._id.toString(), branchId: body.branchId, isPaid: body.isPaid })
        return true
    }

    async getAllMemberships(query: any) {
        const { page, size } = query
        const features = new APIFeatures(query, this.membershipModel.find()
            .sort({ startDate: 1 })
            .select('duration startDate endDate price isActive isPaid userId branchId')
            .populate('userId', 'firstName ')
            .populate('branchId', 'name'))
            .pagination({ page, size })
        const memberships = await features.mongooseQuery
        if(!memberships.length) throw new NotFoundException('No memberships found')
        return memberships
    }

    async getMembership(params: any) {
        const membership = await this.membershipModel.findById(params.membershipId)
            .select("duration startDate endDate price isActive isPaid userId branchId")
            .populate('userId', 'firstName lastName phoneNumber email memberStatus gender profileImg.secure_url weight height')
            .populate('branchId', 'name')
        if(!membership) throw new NotFoundException('Membership not found')
        return membership
    }

    async getAllMembershipsForUser(params: any) {
        const memberships = await this.membershipModel.find({ userId: params.userId })
            .select('duration startDate endDate price isActive isPaid userId branchId')
            .populate('userId', 'firstName')
            .populate('branchId', 'name')
        if(!memberships.length) throw new NotFoundException('No memberships found for this user')
        return memberships
    }

    async getAllMembershipsForBranch(params: any) {
        const memberships = await this.membershipModel.find({ branchId: params.branchId })
            .select('duration startDate endDate price isActive isPaid userId branchId')
            .populate('userId', 'firstName')
            .populate('branchId', 'name')
        if(!memberships.length) throw new NotFoundException('No memberships found for this branch')
        return memberships
    }

    async updateMembershipByAdmin(body: any, params: any) {
        const membership = await this.membershipModel.findById(params.membershipId)
        if(!membership) throw new NotFoundException('Membership not found')
        if(membership.isActive) throw new BadRequestException('Membership is active and cannot be updated')
        // set price & time
        const finalDuration = body.duration ?? membership.duration
        const start = new Date(body.startDate ?? membership.startDate)
        const endDate = new Date(start)
        endDate.setMonth(endDate.getMonth() + finalDuration)
        const priceMap = { 1: 400, 3: 950, 6: 1800, 12: 3600 };
        const price = priceMap[finalDuration];
        membership.duration = finalDuration
        membership.price = price
        membership.startDate = start
        membership.endDate = endDate
        if(body.isActive) membership.isActive = body.isActive
        if(body.isPaid) membership.isPaid = body.isPaid
        await membership.save()
        return true
    }

    async deleteMembershipByAdmin(params: any) {
        const membership = await this.membershipModel.findById(params.membershipId)
        if(!membership) throw new NotFoundException('Membership not found')
        if(membership.isActive || membership.isPaid) throw new BadRequestException('Membership is active and cannot be deleted')
        await membership.deleteOne()
        return true
    }

    //user

    async addMembership(body: any, req: any) {
        //check branch id
        const branch = await this.branchModel.findById(body.branchId)
        if(!branch || !branch.isActive) throw new NotFoundException('Branch not found')
        // set price & time
        const priceMap = { 1: 400, 3: 950, 6: 1800, 12: 3600 };
        const price = priceMap[body.duration];
        const endDate = new Date(body.startDate)
        endDate.setMonth(endDate.getMonth() + body.duration)
        await this.membershipModel.create({ duration: body.duration, startDate: body.startDate, endDate, price,
            userId: req.authUser.id, branchId: body.branchId })
        return true
    }

    async getAllMyMemberships(req: any) {
        const memberships = await this.membershipModel.find({ userId: req.authUser.id})
            .sort({ startDate: 1 })
            .select('duration startDate endDate price isActive isPaid userId branchId')
            .populate('userId', 'firstName ')
            .populate('branchId', 'name')
        if(!memberships.length) throw new NotFoundException('No memberships found for you')
        return memberships
    }

    async getMyMembership(params: any, req: any) {
        const membership = await this.membershipModel.findOne({ _id: params.membershipId, userId: req.authUser.id })
            .select("duration startDate endDate price isActive isPaid userId branchId")
            .populate('userId', 'firstName lastName phoneNumber email memberStatus gender profileImg.secure_url weight height')
            .populate('branchId', 'name')
        if(!membership) throw new NotFoundException('Membership not found')
        return membership
    }

    async updateMyMembership(body: any, req: any, params: any) {
        const membership = await this.membershipModel.findOne({ _id: params.membershipId, userId: req.authUser.id })
        if(!membership) throw new NotFoundException('Membership not found')
        if(membership.isActive) throw new BadRequestException('Membership is active and cannot be updated')
        // set price & time
        const finalDuration = body.duration ?? membership.duration
        const start = new Date(body.startDate ?? membership.startDate)
        const endDate = new Date(start)
        endDate.setMonth(endDate.getMonth() + finalDuration)
        const priceMap = { 1: 400, 3: 950, 6: 1800, 12: 3600 };
        const price = priceMap[finalDuration];
        membership.duration = finalDuration
        membership.price = price
        membership.startDate = start
        membership.endDate = endDate
        await membership.save()
        return true
    }

    async deleteMyMembership(req: any, params: any) {
        const membership = await this.membershipModel.findOne({ _id: params.membershipId, userId: req.authUser.id })
        if(!membership) throw new NotFoundException('Membership not found')
        if(membership.isActive || membership.isPaid) throw new BadRequestException('Membership is active and cannot be deleted')
        await membership.deleteOne()
        return true
    }


}