import { PartialType } from "@nestjs/swagger";
import { Users } from "../schemas/users.schema";

export class UpdateUserInforDto extends PartialType(Users) {}
