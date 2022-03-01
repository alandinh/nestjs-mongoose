import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";
import { TokenTypes } from "../constants/token.constant";
import { Options } from "common/config/mongoose.config";
import { USERS_MODEL } from "modules/users/schemas/users.schema";

export const TOKENS_MODEL = "user-tokens";
@Schema(Options)
export class Tokens {
  @Prop({ required: true, index: true })
  token: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: USERS_MODEL })
  user: string;

  @Prop({
    enum: TokenTypes,
    required: true,
  })
  type: string;

  @Prop({ required: true })
  expires: Date;

  @Prop({ required: true, default: false })
  blacklisted: boolean;
}

export type TokensDocument = Tokens & Document;

export const TokensSchema = SchemaFactory.createForClass(Tokens);
