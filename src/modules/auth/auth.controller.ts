import { Body, Controller, HttpStatus, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { AuthMessage } from "./constants/auth-message.enum";
import { EmailLoginDto } from "./dto/email-login.dto";
import { EmailRegisterDto } from "./dto/email-register.dto";
import {
  LogOutDto,
  RefreshTokenDto,
  ResponseLogOutDto,
  ResponseRefreshTokenDto,
} from "./dto/refresh-token.dto";
import { ResponseLogInDto } from "./dto/response-login.dto";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @ApiOperation({ summary: "Register with email and password" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: AuthMessage.LOGGED_IN,
    type: ResponseLogInDto,
  })
  async register(
    @Body() registerDto: EmailRegisterDto,
  ): Promise<ResponseLogInDto> {
    return this.authService.registerUser(registerDto);
  }

  @Post("login")
  @ApiOperation({ summary: "Loggin with email and password" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: AuthMessage.LOGGED_IN,
    type: ResponseLogInDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: AuthMessage.LOGGIN_FAILED,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: AuthMessage.LOGGIN_FAILED,
  })
  async logIn(@Body() logInDto: EmailLoginDto): Promise<ResponseLogInDto> {
    return this.authService.emailLogin(logInDto);
  }

  @Post("logout")
  @ApiOperation({ summary: `Log out and remove refresh token` })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: AuthMessage.LOGGED_OUT,
    type: ResponseLogOutDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: AuthMessage.REFRESH_TOKEN_NOT_FOUND,
  })
  async logOut(@Body() logOutDto: LogOutDto): Promise<ResponseLogOutDto> {
    return this.authService.logOut(logOutDto.refreshToken);
  }

  @Post("refresh-tokens")
  @ApiOperation({ summary: `get a new access and refresh token` })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: AuthMessage.REFRESHED_TOKEN_OK,
    type: ResponseRefreshTokenDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: AuthMessage.REFRESH_TOKEN_NOT_FOUND,
  })
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<ResponseRefreshTokenDto> {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }

  @Post("verify-email")
  @ApiOperation({ summary: "Verify Email" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: AuthMessage.VERIFIED_EMAIL,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: AuthMessage.VERIFIED_EMAIL_FAILED,
  })
  async verifyEmail(@Body() verifyEmailToken: string) {
    return this.authService.verifyEmail(verifyEmailToken);
  }
}
