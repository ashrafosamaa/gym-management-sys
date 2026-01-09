import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, required: true, trim: true })
  firstName: string;

  @Prop({ type: String, required: true, trim: true })
  lastName: string;

  @Prop({ type: String, required: true, unique: true})
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, required: true, length: 11, unique: true })
  phoneNumber: string;

  // additional information

  @Prop({ type: String, required: true, enum: ['male', 'female'] })
  gender: string;

  @Prop({ type: String, required: true })
  weight: string;

  @Prop({ type: String, required: true})
  height: string;

  @Prop({ type: String, required: true, enum: ['active', 'inactive'], default: 'inactive' })
  memberStatus: string;

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

  // account activation

  @Prop({ type : Boolean , required : true , default : false })
  isAccountActivated : boolean

  @Prop({ type: String, })
  accountActivateCode : string

  @Prop({ type: String })
  passwordResetCode: string;

  @Prop({ type: Boolean, default: false })
  passwordResetReq: boolean;

  // role

  @Prop({ type: String, required: true, default: 'user', enum: ['user'] })
  role: string;
}

export const userSchema = SchemaFactory.createForClass(User);
