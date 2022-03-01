import { Moment } from "moment";
import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CreateTokenDto {
  @ApiProperty()
  user: string;

  @ApiProperty()
  expires: Moment;

  @ApiProperty()
  @IsString()
  type: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  secret?: string;
}
