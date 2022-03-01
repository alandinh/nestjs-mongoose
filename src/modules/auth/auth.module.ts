import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UsersModule } from "./../users/users.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { TokensSchema, TOKENS_MODEL } from "./schemas/tokens.schema";
import { TokensService } from "./token.service";

@Module({
  imports: [
    forwardRef(() => UsersModule),
    MongooseModule.forFeature([{ name: TOKENS_MODEL, schema: TokensSchema }]),
  ],

  controllers: [AuthController],
  providers: [AuthService, TokensService],
  exports: [AuthService, TokensService],
})
export class AuthModule {}
