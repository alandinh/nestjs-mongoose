import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { ResponseUsersDto } from "./../../users/dto/response-users.dto";

class ResponseTokenDto {
  @ApiProperty()
  @IsString()
  token: string;

  @ApiProperty()
  expires?: Date;
}

class TokenDto {
  @ApiProperty()
  access: ResponseTokenDto;

  @ApiProperty()
  refresh: ResponseTokenDto;
}

export class ResponseLogInDto {
  @ApiProperty()
  user: ResponseUsersDto;

  @ApiProperty()
  tokens: TokenDto;
}
