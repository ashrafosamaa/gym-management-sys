import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Sub {
  @Prop({ type: Number, required: true, enum: [ 1, 3, 6, 12 ] })
  duration: number;

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({ type: Date, required: true})
  startDate: Date;

  @Prop({ type: Date, required: true})
  endDate: Date;

  @Prop({ type : Types.ObjectId , ref : 'User' , required : true })
  userId : Types.ObjectId

  @Prop({ type : Types.ObjectId , ref : 'Trainer' , required : true })
  trainerId : Types.ObjectId

  @Prop({ type : Types.ObjectId , ref : 'Branch' , required : true })
  branchId : Types.ObjectId

  @Prop({ type : Boolean , required : true , default : false })
  isActive : boolean

  @Prop({ type : Boolean , required : true , default : false })
  isPaid : boolean

  @Prop({ type: String, required: true })
  comment: string;

}

export const subSchema = SchemaFactory.createForClass(Sub);
