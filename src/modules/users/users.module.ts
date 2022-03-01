import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { generateHash } from "common/utils/bcrypt";
import { AuthModule } from "../auth/auth.module";
import { UsersSchema, USERS_MODEL } from "./schemas/users.schema";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Module({
  imports: [
    forwardRef(() => AuthModule),
    MongooseModule.forFeatureAsync([
      {
        name: USERS_MODEL,
        useFactory: () => {
          const schema = UsersSchema;
          schema.pre("save", function () {
            const password = this.get("password") as string;
            this.set("password", generateHash(password));
          });
          return schema;
        },
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
