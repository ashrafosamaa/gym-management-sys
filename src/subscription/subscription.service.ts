import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../DB/models/user.model';
import { APIFeatures } from '../utils/api-feature';
import { Sub } from 'src/DB/models/subscription.model';
import { Trainer } from 'src/DB/models/trainer.model';
import { Membership } from 'src/DB/models/membership.model';


@Injectable()
export class SubService {
    constructor(
        @InjectModel(Sub.name) private subModel: Model<Sub>,
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Trainer.name) private trainerModel: Model<Trainer>,
        @InjectModel(Membership.name) private membershipModel: Model<Membership>,
    ) {}

    async addSubByAdmin(body: any) {
        const user = await this.userModel.findOne({ phoneNumber: body.phoneNumber }).select('_id')
        if(!user) throw new NotFoundException('User not found')
        //check membership 
        const membership = await this.membershipModel.findOne({ userId: user._id, isActive: true, isPaid: true})
        if(!membership) throw new NotFoundException('User has no membership')
        //check branch id
        const trainer = await this.trainerModel.findById({ _id: body.trainerId })
        if(!trainer || !trainer.isActive) throw new NotFoundException('Trainer not found')
        // set price & time
        const price = trainer.pricePerMonth * body.duration;
        const endDate = new Date(body.startDate)
        endDate.setMonth(endDate.getMonth() + body.duration)
        await this.subModel.create({ duration: body.duration, startDate: body.startDate, endDate, price,
            userId: user._id.toString(), trainerId: body.trainerId, branchId: trainer.branchId, isPaid: body.isPaid })
        return true
    }

    async getAllSubs(query: any) {
        const { page, size } = query
        const features = new APIFeatures(query, this.subModel.find()
            .sort({ startDate: 1 })
            .select('duration startDate endDate price isActive isPaid')
            .populate('userId', 'firstName')
            .populate('trainerId', 'userName')
            .populate('branchId', 'name'))
            .pagination({ page, size })
        const subs = await features.mongooseQuery
        if(!subs.length) throw new NotFoundException('No subscriptions found')
        return subs
    }

    async getSub(params: any) {
        const sub = await this.subModel.findById(params.subId)
            .select("duration startDate endDate price isActive isPaid")
            .populate('userId', 'firstName lastName phoneNumber email memberStatus weight height')
            .populate('trainerId', 'userName phoneNumber specialization experience pricePerMonth')
            .populate('branchId', 'name')
        if(!sub) throw new NotFoundException('Subscription not found')
        return sub
    }

    async getAllSubsForUser(params: any) {
        const subs = await this.subModel.find({ userId: params.userId })
            .sort({ startDate: 1 })
            .select('duration startDate endDate price isActive isPaid')
            .populate('userId', 'firstName')
            .populate('trainerId', 'userName')
            .populate('branchId', 'name')
        if(!subs.length) throw new NotFoundException('No subscriptions found for this user')
        return subs
    }

    async getAllSubsForTrainer(params: any) {
        const subs = await this.subModel.find({ trainerId: params.trainerId })
            .sort({ startDate: 1 })
            .select('duration startDate endDate price isActive isPaid')
            .populate('userId', 'firstName')
            .populate('trainerId', 'userName')
            .populate('branchId', 'name')
        if(!subs.length) throw new NotFoundException('No subscriptions found for this trainer')
        return subs
    }

    async getAllSubsForBranch(params: any) {
        const subs = await this.subModel.find({ branchId: params.branchId })
            .select('duration startDate endDate price isActive isPaid')
            .populate('userId', 'firstName')
            .populate('trainerId', 'userName')
            .populate('branchId', 'name')
        if(!subs.length) throw new NotFoundException('No subscriptions found for this branch')
        return subs
    }

    async updateSubByAdmin(body: any, params: any) {
        const sub = await this.subModel.findById(params.subId)
            .populate('trainerId', 'pricePerMonth')
        if(!sub) throw new NotFoundException('Subscription not found')
        if(sub.isActive || sub.isPaid) throw new BadRequestException('You can not update this subscription now')
        // set price & time
        const finalDuration = body.duration ?? sub.duration
        const start = new Date(body.startDate ?? sub.startDate)
        const endDate = new Date(start)
        endDate.setMonth(endDate.getMonth() + finalDuration)
        const trainer = sub.trainerId as any;
        const price = trainer.pricePerMonth * finalDuration
        sub.duration = finalDuration
        sub.price = price
        sub.startDate = start
        sub.endDate = endDate
        if(body.isActive !== undefined) sub.isActive = body.isActive
        if(body.isPaid !== undefined) sub.isPaid = body.isPaid
        await sub.save()
        return true
    }

    async deleteSubByAdmin(params: any) {
        const sub = await this.subModel.findById(params.subId)
        if(!sub) throw new NotFoundException('sub not found')
        if(sub.isActive || sub.isPaid) throw new BadRequestException('Subscription is active and cannot be deleted')
        await sub.deleteOne()
        return true
    }

    //user

    async addSub(body: any, req: any) {
        //check membership 
        const membership = await this.membershipModel.findOne({ userId:req.authUser.id, isActive: true, isPaid: true})
        if(!membership) throw new NotFoundException('You have no active membership')
        //check branch id
        const trainer = await this.trainerModel.findById(body.trainerId)
        if(!trainer || !trainer.isActive) throw new NotFoundException('Trainer not found')
        // set price & time
        const price = trainer.pricePerMonth * body.duration;
        const endDate = new Date(body.startDate)
        endDate.setMonth(endDate.getMonth() + body.duration)
        await this.subModel.create({ duration: body.duration, startDate: body.startDate, endDate, price,
            userId: req.authUser.id, trainerId: body.trainerId, branchId: trainer.branchId })
        return true
    }

    async getAllMySubs(req: any) {
        const subs = await this.subModel.find({ userId: req.authUser.id})
            .sort({ startDate: 1 })
            .select('duration startDate endDate price isActive isPaid')
            .populate('userId', 'firstName')
            .populate('trainerId', 'userName')
            .populate('branchId', 'name')
        if(!subs.length) throw new NotFoundException('No subscriptions found for you')
        return subs
    }

    async getMySub(params: any, req: any) {
        const sub = await this.subModel.findOne({ _id: params.subId, userId: req.authUser.id })
            .select("duration startDate endDate price isActive isPaid")
            .populate('userId', 'firstName lastName phoneNumber email memberStatus weight height')
            .populate('trainerId', 'userName phoneNumber specialization experience pricePerMonth')
            .populate('branchId', 'name')
        if(!sub) throw new NotFoundException('Subscription not found')
        return sub
    }

    async updateMySub(body: any, req: any, params: any) {
        const sub = await this.subModel.findOne({ _id: params.subId, userId: req.authUser.id })
            .populate('trainerId', 'pricePerMonth')
        if(!sub) throw new NotFoundException('Subscription not found')
        if(sub.isActive || sub.isPaid) throw new BadRequestException('You can not update this subscription now')
        // set price & time
        const finalDuration = body.duration ?? sub.duration
        const start = new Date(body.startDate ?? sub.startDate)
        const endDate = new Date(start)
        endDate.setMonth(endDate.getMonth() + finalDuration)
        const trainer = sub.trainerId as any;
        const price = trainer.pricePerMonth * finalDuration
        sub.duration = finalDuration
        sub.price = price
        sub.startDate = start
        sub.endDate = endDate
        await sub.save()
        return true
    }

    async addCommentAndRate (body: any, req: any, params: any) {
        const sub = await this.subModel.findOne({ _id: params.subId, userId: req.authUser.id })
        if(!sub) throw new NotFoundException('Subscription not found')
        if(sub.comment) throw new BadRequestException('You have already commented on this subscription')
        const trainer = await this.trainerModel.findById(sub.trainerId)
        trainer.rate = ((trainer.rate * trainer.rateCount) + body.rate) / (trainer.rateCount + 1)
        trainer.rateCount += 1
        await trainer.save()
        sub.comment = body.comment
        await sub.save()
        return true
    }

    async deleteMySub(req: any, params: any) {
        const sub = await this.subModel.findOne({ _id: params.subId, userId: req.authUser.id })
        if(!sub) throw new NotFoundException('Subscription not found')
        if(sub.isActive || sub.isPaid) throw new BadRequestException('Subscription is active and cannot be deleted')
        await sub.deleteOne()
        return true
    }

}