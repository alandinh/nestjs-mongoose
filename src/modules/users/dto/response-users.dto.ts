import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsEmail, IsBoolean } from "class-validator";

export class ResponseUsersDto {
  @ApiProperty()
  @IsString()
  _id?: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsBoolean()
  verified: boolean;

  @ApiProperty()
  @IsString()
  role: string;
}
