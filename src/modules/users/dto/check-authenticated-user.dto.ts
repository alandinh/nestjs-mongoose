import { PartialType } from "@nestjs/swagger";
import { ResponseUsersDto } from "./response-users.dto";

export class CheckAuthenticatedUserDto extends PartialType(ResponseUsersDto) {}
