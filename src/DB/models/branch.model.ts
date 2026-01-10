import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Branch {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: String, required: true })
  address: string;

  @Prop({ type : Boolean , required : true , default : true })
  isActive : boolean

}

export const branchSchema = SchemaFactory.createForClass(Branch);
