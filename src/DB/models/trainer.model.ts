import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Trainer {
  @Prop({ type: String, required: true, trim: true, unique: true })
  userName: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: Number, required: true })
  experience: number;

  @Prop({ type : Types.ObjectId , ref : 'Branch' , required : true })
  branchId : Types.ObjectId

  @Prop({ type: String })
  passwordOneUse: string;

  @Prop({ type: String })
  password: string;

  @Prop({ type: String, required: true, length: 11, unique: true })
  phoneNumber: string;

  @Prop({ type: String, required: true, enum: ['male', 'female'] })
  gender: string;

  @Prop({ type: String, required: true, enum: [ "Personal", "Bodybuilding", "Functional", "Cardio",
            "Rehabilitation", "Physiotherapy", "Yoga", "Nutrition" ] })
  specialization: string;

  @Prop({ type: Number, required: true })
  pricePerMonth: number;

  @Prop({ type: Number, default: 0 })
  rate: number;

  @Prop({ type: Number, default: 0 })
  rateCount: number;

  @Prop({ type : Boolean , required : true , default : false })
  isActive : boolean

  @Prop({ type : Boolean , required : true , default : true })
  isFirstTime : boolean

  @Prop({ type: String, required: true, default: 'trainer', enum: ['trainer'] })
  role: string;

  @Prop({ type : Boolean , required : true , default : false })
  passwordChnageReq : boolean

  // profile image

  @Prop({ type:
    {secure_url: { type: String },
    public_id: { type: String }},})
  profileImg: {
    secure_url: string;
    public_id: string;
  };

  @Prop({ type : String })
  folderId : string

}

export const trainerSchema = SchemaFactory.createForClass(Trainer);
