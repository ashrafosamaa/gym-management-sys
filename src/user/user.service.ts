import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../DB/models/user.model';
import { Membership } from '../DB/models/membership.model';
import { APIFeatures } from '../utils/api-feature';
import { JwtService } from '@nestjs/jwt';
import { cloudinaryConn } from '../utils/cloudinary-connection';
import * as bcrypt from 'bcrypt'


@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Membership.name) private membershipModel: Model<Membership>,
        private jwtService: JwtService
    ) {}

    async getAllUsers(query: any) {
        const { page, size, sortBy } = query
        const features = new APIFeatures(query, this.userModel.find({ isAccountActivated: true })
            .select('firstName lastName phoneNumber email memberStatus gender'))
            .pagination({ page, size })
            .sort(sortBy)
        const users = await features.mongooseQuery
        if(!users.length) throw new NotFoundException('No users found')
        return users
    }

    async getUser(params: any) {
        const user = await this.userModel.findOne({ _id: params.userId, isAccountActivated: true })
            .select("firstName lastName phoneNumber email memberStatus gender profileImg.secure_url weight height")
        if(!user) throw new NotFoundException('User not found')
        return user
    }

    async searchUsers(query: any) {
        const { ...search } = query
        const features = new APIFeatures(query, this.userModel.find()
            .select("firstName lastName phoneNumber email memberStatus gender"))
            .searchUsers(search)
        const users = await features.mongooseQuery
        if(!users.length) throw new NotFoundException('No users found')
        return users
    }

    async updateUserAcc(body: any, params: any) {
        const user = await this.userModel.findById(params.userId)
        if(!user) throw new NotFoundException('User not found')
        if(body.phoneNumber){
            const isPhoneExist = await this.userModel.findOne({ phoneNumber: body.phoneNumber, _id: {$ne: params.parentId} })
            if(isPhoneExist) throw new ConflictException('Phone number already exists')
            user.phoneNumber = body.phoneNumber
        }
        if(body.firstName) user.firstName = body.firstName
        if(body.lastName) user.lastName = body.lastName
        if(body.weight) user.weight = body.weight
        if(body.height) user.height = body.height
        if(body.gender) user.gender = body.gender
        if(body.memberStatus) user.memberStatus = body.memberStatus
        await user.save()
        return true
    }

    async deleteUserAcc(params: any) {
        const user = await this.userModel.findById(params.userId)
        if(!user) throw new NotFoundException('User not found')
        // delete photo
        if(user.profileImg.public_id){
        const folder = `${process.env.MAIN_FOLDER}/Users/${user.folderId}`
        await cloudinaryConn().api.delete_resources_by_prefix(folder)
        await cloudinaryConn().api.delete_folder(folder)
        }
        await this.membershipModel.deleteMany({ userId: user._id })
        await user.deleteOne()
        return true
    }

    async getMyAcc(req: any) {
        const user = await this.userModel.findById(req.authUser.id)
            .select("firstName lastName phoneNumber email memberStatus gender profileImg.secure_url weight height")
        return user
    }

    async updateMyAcc(body: any, req: any) {
        const user = await this.userModel.findById(req.authUser.id)
        if(body.phoneNumber){
            const isPhoneExist = await this.userModel.findOne({ phoneNumber: body.phoneNumber, _id: {$ne: req.authUser.id} })
            if(isPhoneExist) throw new ConflictException('Phone number already exists')
            user.phoneNumber = body.phoneNumber
        }
        if(body.firstName) user.firstName = body.firstName
        if(body.lastName) user.lastName = body.lastName
        if(body.weight) user.weight = body.weight
        if(body.height) user.height = body.height
        if(body.gender) user.gender = body.gender
        await user.save()
        return true
    }

    async updateMyPassword(body: any, req: any) {
        const user = await this.userModel.findById(req.authUser.id)
        const { oldPassword, newPassword } = body
        if(!bcrypt.compareSync(oldPassword, user.password)) throw new BadRequestException('Invalid old password')
        const hashPassword = bcrypt.hashSync(newPassword, +process.env.SALT_ROUNDS)
        user.password = hashPassword
        await user.save()
        const userToken = this.jwtService.sign({ id: user._id, name: user.firstName, email: user.email, role: "user" },
            { secret: process.env.JWT_SECRET_LOGIN, expiresIn: "90d" })
        return userToken
    }

    async deleteMyAcc(req: any) {
        const user = await this.userModel.findById(req.authUser.id)
        // delete photo
        if(user.profileImg.public_id){
        const folder = `${process.env.MAIN_FOLDER}/Users/${user.folderId}`
        await cloudinaryConn().api.delete_resources_by_prefix(folder)
        await cloudinaryConn().api.delete_folder(folder)
        }
        await this.membershipModel.deleteMany({ userId: req.authUser.id })
        await user.deleteOne()
        return true
    }

    async addProfilePicture (file:any, req: any) {
        const user = await this.userModel.findById(req.authUser.id)
        if(!file) throw new BadRequestException('File picture not found')
        const folderId = Math.floor(1000 + Math.random() * 9000).toString()
        const {secure_url, public_id} = await cloudinaryConn().uploader.upload(file.path, {
            folder: `${process.env.MAIN_FOLDER}/Users/${folderId}`
        })
        const profileImg = { secure_url, public_id }
        user.profileImg = profileImg
        user.folderId = folderId
        await user.save()
        return true
    }

    async updateProfilePicture ( req: any, file:any, body: any) {
        const user = await this.userModel.findById(req.authUser.id)
        if(!file) throw new BadRequestException('File picture not found')
        if(user.profileImg.public_id != body.oldPublicId){
            throw new BadRequestException("You cannot update this profile's picture")
        }
        const newPublicId = body.oldPublicId.split(`${user.folderId}/`)[1]
        const {secure_url, public_id} = await cloudinaryConn().uploader.upload(req.file.path, {
            folder: `${process.env.MAIN_FOLDER}/Users/${user.folderId}`,
            public_id: newPublicId
        })
        const profileImg = { secure_url, public_id }
        user.profileImg = profileImg
        await user.save()
        return true
    }

}