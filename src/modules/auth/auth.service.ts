import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { AuthMessage } from "./constants/auth-message.enum";
import { TokenTypes } from "./constants/token.constant";
import { EmailLoginDto } from "./dto/email-login.dto";
import { EmailRegisterDto } from "./dto/email-register.dto";
import {
  ResponseLogOutDto,
  ResponseRefreshTokenDto,
} from "./dto/refresh-token.dto";
import { TokensService } from "./token.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly tokenService: TokensService,
    private readonly userService: UsersService,
  ) {}

  async registerUser(data: EmailRegisterDto) {
    const user = await this.userService.create(data);
    const tokens = await this.tokenService.generateAuthTokens(user);
    return {
      user,
      tokens,
    };
  }

  async emailLogin(data: EmailLoginDto) {
    const user = await this.userService.verifyUser(data);
    const tokens = await this.tokenService.generateAuthTokens(user);
    return {
      user,
      tokens,
    };
  }

  async verifyEmail(verifyEmailToken) {
    const verifyEmailTokenDoc = await this.tokenService.verifyToken(
      verifyEmailToken,
      TokenTypes.VERIFY_EMAIL,
    );
    const user = await this.userService.getUser(verifyEmailTokenDoc._id);

    await this.tokenService.deleteManyTokens(user.id, TokenTypes.VERIFY_EMAIL);
    await this.userService.updateUser(user.id, { verified: true });
  }

  async decodeAccessToken(
    accessToken: string,
  ): Promise<any /*ResponseUsersDto*/> {
    const decodedToken: any = await this.tokenService.verifyToken(
      accessToken,
      TokenTypes.ACCESS,
    );
    if (!decodedToken) {
      throw new UnauthorizedException("UNAUTHORIZED");
    }
    return decodedToken;
  }

  async logOut(refreshToken: string): Promise<ResponseLogOutDto> {
    await this.tokenService.findAndRemoveRefreshToken(refreshToken);

    return {
      message: AuthMessage.LOGGED_OUT,
    };
  }

  async refreshToken(refreshToken: string): Promise<ResponseRefreshTokenDto> {
    const refreshTokenDoc = await this.tokenService.findAndRemoveRefreshToken(
      refreshToken,
    );
    const userDoc = await this.userService.getUser(refreshTokenDoc._id);
    const newTokens = await this.tokenService.generateAuthTokens(userDoc);
    return {
      user: userDoc.id,
      tokens: newTokens,
    };
  }
}
