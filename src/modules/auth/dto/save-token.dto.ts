import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString } from "class-validator";

export class SaveTokenDto {
  @ApiProperty()
  @IsString()
  token: string;

  @ApiProperty()
  user: any;

  @ApiProperty()
  expires: any;

  @ApiProperty()
  @IsString()
  type: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  blacklisted?: boolean;
}
