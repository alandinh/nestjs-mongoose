import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { ToLowerCase, Trim } from "common/decorators/transforms.decorator";

export class EmailLoginDto {
  @ApiProperty({
    description: "Enter your email address",
  })
  @IsEmail()
  @IsNotEmpty()
  @Trim()
  @ToLowerCase()
  email: string;

  @ApiProperty({
    description: "Enter your password",
    minLength: 6,
  })
  @IsString()
  @Trim()
  @MinLength(6)
  password: string;
}
