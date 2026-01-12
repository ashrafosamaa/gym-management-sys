import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Trainer } from '../DB/models/trainer.model';
import { Branch } from '../DB/models/branch.model';
import { APIFeatures } from '../utils/api-feature';
import { JwtService } from '@nestjs/jwt';
import { cloudinaryConn } from '../utils/cloudinary-connection';
import * as bcrypt from 'bcrypt'


@Injectable()
export class TrainerService {
    constructor(
        @InjectModel(Trainer.name) private trainerModel: Model<Trainer>,
        @InjectModel(Branch.name) private branchModel: Model<Branch>,
        private jwtService: JwtService
    ) {}

    async addTrainer(body: any) {
        const isUserNameExist = await this.trainerModel.findOne({ userName: body.userName })
        if(isUserNameExist) throw new NotFoundException(' User name is already exists')
        const isPhoneNumberExist = await this.trainerModel.findOne({ phoneNumber: body.phoneNumber })
        if(isPhoneNumberExist) throw new NotFoundException('Phone number is already exists')
        //check branch id
        const branch = await this.branchModel.findById(body.branchId)
        if(!branch || !branch.isActive) throw new NotFoundException('Branch not found')
        // set password
        const hashPassword = bcrypt.hashSync(body.phoneNumber, +process.env.SALT_ROUNDS)
        await this.trainerModel.create({ userName: body.userName, description: body.description, experience: body.experience,
            phoneNumber: body.phoneNumber, gender: body.gender, pricePerMonth: body.pricePerMonth,
            specialization: body.specialization, passwordOneUse: hashPassword, branchId: body.branchId })
        return true
    }

    async getAllTrainers(query: any) {
        const { page, size, sortBy } = query
        const features = new APIFeatures(query, this.trainerModel.find({ isActive: true })
            .select('userName gender specialization pricePerMonth experience isActive isFirstTime')
            .populate('branchId', 'name'))
            .pagination({ page, size })
            .sort(sortBy)
        const trainers = await features.mongooseQuery
        if(!trainers.length) throw new NotFoundException('No trainers found')
        return trainers
    }

    async getTrainersByBranchId(params: any) {
        const trainers = await this.trainerModel.find({ branchId: params.branchId, isActive: true })
            .select('userName gender specialization pricePerMonth experience isActive isFirstTime')
            .populate('branchId', 'name')
        if(!trainers.length) throw new NotFoundException('No trainers found in this branch')
        return trainers
    }

    async getTrainer(params: any) {
        const trainer = await this.trainerModel.findOne({ _id: params.trainerId, isActive: true })
            .select("-__v -password -role -folderId -profileImg.public_id -createdAt -updatedAt -passwordOneUse")
            .populate('branchId', 'name')
        if(!trainer) throw new NotFoundException('Trainer not found')
        return trainer
    }

    async searchTrainers(query: any) {
        const { ...search } = query
        const features = new APIFeatures(query, this.trainerModel.find()
            .select("userName gender specialization pricePerMonth experience isActive isFirstTime")
            .populate('branchId', 'name'))
            .searchTrainers(search)
        const trainers = await features.mongooseQuery
        if(!trainers.length) throw new NotFoundException('No trainers found')
        return trainers
    }

    async updateTrainerAcc(body: any, params: any) {
        const trainer = await this.trainerModel.findById(params.trainerId)
        if(!trainer) throw new NotFoundException('Trainer not found')
        if(body.userName){
            const isUserNameExist = await this.trainerModel.findOne({ userName: body.userName, _id: {$ne: params.trainerId} })
            if(isUserNameExist) throw new ConflictException('User name already exists')
            trainer.userName = body.userName
        }
        if(body.phoneNumber){
            const isPhoneExist = await this.trainerModel.findOne({ phoneNumber: body.phoneNumber, _id: {$ne: params.trainerId} })
            if(isPhoneExist) throw new ConflictException('Phone number already exists')
            trainer.phoneNumber = body.phoneNumber
        }
        if(body.branchId) {
            const branch = await this.branchModel.findById(body.branchId)
            if(!branch || !branch.isActive) throw new NotFoundException('Branch not found')
            trainer.branchId = body.branchId
        }
        if(body.description) trainer.description = body.description
        if(body.experience) trainer.experience = body.experience
        if(body.pricePerMonth) trainer.pricePerMonth = body.pricePerMonth
        if(body.specialization) trainer.specialization = body.specialization
        if(body.gender) trainer.gender = body.gender
        if(body.isActive && !trainer.isFirstTime) trainer.isActive = body.isActive
        await trainer.save()
        return true
    }

    async deleteTrainerAcc(params: any) {
        const trainer = await this.trainerModel.findById(params.trainerId)
        if(!trainer) throw new NotFoundException('Trainer not found')
        // delete photo
        if(trainer.folderId){
        const folder = `${process.env.MAIN_FOLDER}/Trainers/${trainer.folderId}`
        await cloudinaryConn().api.delete_resources_by_prefix(folder)
        await cloudinaryConn().api.delete_folder(folder)
        }
        await trainer.deleteOne()
        return true
    }

    // trainer

    async firstLogin(body: any) {
        const trainer = await this.trainerModel.findOne({ userName: body.userName, isFirstTime: true })
        if(!trainer) throw new NotFoundException('Trainer not found')
        if(!trainer.isFirstTime) throw new BadRequestException('Trainer already activated')
        const isPasswordMatch = bcrypt.compareSync(body.passwordOneUse, trainer.passwordOneUse)
        if(!isPasswordMatch) throw new BadRequestException('Invalid password')
        // set new data
        const hashedPassword = bcrypt.hashSync(body.password, +process.env.SALT_ROUNDS)
        trainer.password = hashedPassword
        trainer.isFirstTime = false
        trainer.isActive = true
        trainer.passwordOneUse = null
        await trainer.save()
        return true
    }

    async signIn(body: any) {
        const trainer = await this.trainerModel.findOne({userName : body.userName, isFirstTime: false})
        if(!trainer) throw new BadRequestException('Invalid login credentials')
        const checkPassword = bcrypt.compareSync(body.password, trainer.password)
        if(!checkPassword) throw new BadRequestException('Invalid login credentials')
        const trainerToken = this.jwtService.sign({ id: trainer._id, userName: trainer.userName, role: "trainer" },
            { secret: process.env.JWT_SECRET_LOGIN, expiresIn: "90d" })
        return trainerToken
    }

    async getMyAcc(req: any) {
        const trainer = await this.trainerModel.findById(req.authTrainer.id)
            .select("-__v -password -role -folderId -profileImg.public_id -createdAt -updatedAt -passwordOneUse")
            .populate('branchId', 'name')
        return trainer
    }

    async updateMyAcc(body: any, req: any) {
        const trainer = await this.trainerModel.findById(req.authTrainer.id)
        if(body.userName){
            const isUserNameExist = await this.trainerModel.findOne({ userName: body.userName, _id: {$ne: req.authTrainer.id} })
            if(isUserNameExist) throw new ConflictException('User name already exists')
            trainer.userName = body.userName
        }
        if(body.phoneNumber){
            const isPhoneExist = await this.trainerModel.findOne({ phoneNumber: body.phoneNumber, _id: {$ne: req.authTrainer.id} })
            if(isPhoneExist) throw new ConflictException('Phone number already exists')
            trainer.phoneNumber = body.phoneNumber
        }
        if(body.description) trainer.description = body.description
        if(body.experience) trainer.experience = body.experience
        if(body.pricePerMonth) trainer.pricePerMonth = body.pricePerMonth
        if(body.specialization) trainer.specialization = body.specialization
        if(body.gender) trainer.gender = body.gender
        if(body.isActive) trainer.isActive = body.isActive
        await trainer.save()
        return true
    }

    async updateMyPassword(body: any, req: any) {
        const trainer = await this.trainerModel.findById(req.authTrainer.id)
        if(!bcrypt.compareSync(body.oldPassword, trainer.password)) throw new BadRequestException('Invalid old password')
        const hashPassword = bcrypt.hashSync(body.newPassword, +process.env.SALT_ROUNDS)
        trainer.password = hashPassword
        await trainer.save()
        const trainerToken = this.jwtService.sign({ id: trainer._id, userName: trainer.userName, role: "trainer" },
            { secret: process.env.JWT_SECRET_LOGIN, expiresIn: "90d" })
        return trainerToken
    }

    async deleteMyAcc(req: any) {
        const trainer = await this.trainerModel.findById(req.authTrainer.id)
        // delete photo
        if(trainer.profileImg.public_id){
        const folder = `${process.env.MAIN_FOLDER}/Trainers/${trainer.folderId}`
        await cloudinaryConn().api.delete_resources_by_prefix(folder)
        await cloudinaryConn().api.delete_folder(folder)
        }
        // await this.membershipModel.deleteMany({ userId: req.authUser.id })
        await trainer.deleteOne()
        return true
    }

    // profile picture

    async addProfilePicture (file:any, req: any) {
        const trainer = await this.trainerModel.findById(req.authTrainer.id)
        if(trainer.folderId) throw new BadRequestException('You already have a profile picture, you can update it')
        if(!file) throw new BadRequestException('File picture not found')
        const folderId = Math.floor(1000 + Math.random() * 9000).toString()
        const {secure_url, public_id} = await cloudinaryConn().uploader.upload(file.path, {
            folder: `${process.env.MAIN_FOLDER}/Trainers/${folderId}`
        })
        const profileImg = { secure_url, public_id }
        trainer.profileImg = profileImg
        trainer.folderId = folderId
        await trainer.save()
        return true
    }

    async updateProfilePicture ( req: any, file:any, body: any) {
        const trainer = await this.trainerModel.findById(req.authTrainer.id)
        if(!trainer.folderId) throw new BadRequestException('You do not have a profile picture, you can add one first')
        if(!file) throw new BadRequestException('File picture not found')
        if(trainer.profileImg.public_id != body.oldPublicId){
            throw new BadRequestException("You cannot update this profile's picture")
        }
        const newPublicId = body.oldPublicId.split(`${trainer.folderId}/`)[1]
        const {secure_url, public_id} = await cloudinaryConn().uploader.upload(req.file.path, {
            folder: `${process.env.MAIN_FOLDER}/Trainers/${trainer.folderId}`,
            public_id: newPublicId
        })
        const profileImg = { secure_url, public_id }
        trainer.profileImg = profileImg
        await trainer.save()
        return true
    }

    // forget password

    async passwordForgetRequest(body: any) {
        const trainer = await this.trainerModel.findOne({ userName: body.userName, isActive: true, isFirstTime: false })
        if(!trainer) throw new NotFoundException('Trainer not found')
        trainer.passwordChnageReq = true
        await trainer.save()
        return true
    }

    async getTrainersByPassReq() {
        const trainers = await this.trainerModel.find({ passwordChnageReq: true })
            .select('userName gender specialization pricePerMonth experience isActive isFirstTime')
            .populate('branchId', 'name')
        if(!trainers.length) throw new NotFoundException('No trainers found')
        return trainers
    }

    async updateTrainerPass( params: any) {
        const trainer = await this.trainerModel.findById(params.trainerId)
        if(!trainer) throw new NotFoundException('Trainer not found')
        if(!trainer.passwordChnageReq) throw new BadRequestException('Password change request not found')
        trainer.passwordOneUse = bcrypt.hashSync(trainer.phoneNumber, +process.env.SALT_ROUNDS)
        trainer.passwordChnageReq = false
        trainer.isFirstTime = true
        trainer.password = null
        await trainer.save()
        return true
    }
}