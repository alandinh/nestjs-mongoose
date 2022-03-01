import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { validateEmail } from "common/utils";
import { Options } from "common/config/mongoose.config";
import { RoleType } from "common/constants/role-type";

export const USERS_MODEL = "users-admin";
@Schema(Options)
export class Users {
  @Prop({
    require: true,
    index: true,
    trim: true,
    unique: true,
    lowercase: true,
    validate: (address) => validateEmail(address, "email"),
  })
  email: string;

  @Prop({
    require: true,
    index: true,
  })
  firstName: string;

  @Prop({
    require: true,
    index: true,
  })
  lastName: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, default: false })
  verified: boolean;

  @Prop({
    require: true,
    type: String,
    enum: RoleType,
    default: RoleType.ADMIN,
  })
  role: string;
}

export type UsersDocument = Users & Document;

export const UsersSchema = SchemaFactory.createForClass(Users);
