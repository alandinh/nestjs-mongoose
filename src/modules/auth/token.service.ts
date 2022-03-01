import { Injectable, NotFoundException } from "@nestjs/common";
import * as jwt from "jsonwebtoken";
import { InjectModel } from "@nestjs/mongoose";
import { PaginateModel } from "mongoose";
import { TokensDocument, TOKENS_MODEL } from "./schemas/tokens.schema";
import { UsersService } from "modules/users/users.service";
import { CreateTokenDto } from "./dto/create-token.dto";
import { ConfigService } from "../shared/services/config.service";
import * as moment from "moment";
import { SaveTokenDto } from "./dto/save-token.dto";
import { TokenTypes } from "./constants/token.constant";
import { UsersDocument } from "modules/users/schemas/users.schema";
import { AuthMessage } from "./constants/auth-message.enum";

@Injectable()
export class TokensService {
  constructor(
    @InjectModel(TOKENS_MODEL)
    private readonly tokenModel: PaginateModel<TokensDocument>,
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
  ) {}
  /**
   * Generate token
   * @param {ObjectId} user
   * @param {Moment} expires
   * @param {string} type
   * @param {string} [secret]
   * @returns {string}
   */
  generateToken(createTokenDto: CreateTokenDto) {
    const { user, expires, type } = createTokenDto;
    const secret = createTokenDto.secret
      ? createTokenDto.secret
      : this.configService.jwt.secret;
    const payload = {
      sub: user,
      iat: moment().unix(),
      exp: expires.unix(),
      type,
    };
    return jwt.sign(payload, secret);
  }

  /**
   * Save a token
   * @param {string} token
   * @param {ObjectId} userId
   * @param {Moment} expires
   * @param {string} type
   * @param {boolean} [blacklisted]
   * @returns {Promise<Token>}
   */
  async saveToken(saveTokenDto: SaveTokenDto) {
    const { token, user, expires, type, blacklisted } = saveTokenDto;
    return await this.tokenModel.create({
      token,
      user,
      expires: expires.toDate(),
      type,
      blacklisted: blacklisted || false,
    });
  }

  /**
   * Verify token and return token doc (or throw an error if it is not valid)
   * @param {string} token
   * @param {string} type
   * @returns {Promise<Token>}
   */
  async verifyToken(token: string, type: string) {
    const payload = jwt.verify(token, this.configService.jwt.secret);
    const tokenDoc = await this.tokenModel.findOne({
      token,
      type,
      user: payload.sub as string,
      blacklisted: false,
    });
    if (!tokenDoc) {
      throw new Error("Token not found");
    }
    return tokenDoc;
  }

  /**
   * Generate auth tokens
   * @param {User} user
   * @returns {Promise<Object>}
   */
  async generateAuthTokens(user: UsersDocument) {
    const accessTokenExpires = moment().add(
      this.configService.jwt.accessExpirationMinutes,
      "minutes",
    );
    const accessToken = this.generateToken({
      user: user.id,
      expires: accessTokenExpires,
      type: TokenTypes.ACCESS,
    });

    const refreshTokenExpires = moment().add(
      this.configService.jwt.refreshExpirationDays,
      "days",
    );
    const refreshToken = this.generateToken({
      user: user.id,
      expires: refreshTokenExpires,
      type: TokenTypes.REFRESH,
    });
    await this.saveToken({
      token: refreshToken,
      user: user.id,
      expires: refreshTokenExpires,
      type: TokenTypes.REFRESH,
    });

    return {
      access: {
        token: accessToken,
        expires: accessTokenExpires.toDate(),
      },
      refresh: {
        token: refreshToken,
        expires: refreshTokenExpires.toDate(),
      },
    };
  }

  /**
   * Generate reset password token
   * @param {string} email
   * @returns {Promise<string>}
   */
  async generateResetPasswordToken(email: string) {
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new NotFoundException("No users found with this email");
    }
    const expires = moment().add(
      this.configService.jwt.resetPasswordExpirationMinutes,
      "minutes",
    );
    const resetPasswordToken = this.generateToken({
      user: user.id,
      expires,
      type: TokenTypes.RESET_PASSWORD,
    });
    await this.saveToken({
      token: resetPasswordToken,
      user: user.id,
      expires,
      type: TokenTypes.RESET_PASSWORD,
    });
    return resetPasswordToken;
  }

  async generateVerifyEmailToken(user: UsersDocument) {
    const expires = moment().add(
      this.configService.jwt.verifyEmailExpirationMinutes,
      "minutes",
    );
    const verifyEmailToken = this.generateToken({
      user: user.id,
      expires,
      type: TokenTypes.VERIFY_EMAIL,
    });
    await this.saveToken({
      token: verifyEmailToken,
      user: user.id,
      expires,
      type: TokenTypes.VERIFY_EMAIL,
    });
    return verifyEmailToken;
  }

  async findAndRemoveRefreshToken(refreshToken: string): Promise<any> {
    const result = await this.tokenModel.findOneAndRemove({
      token: refreshToken,
      type: TokenTypes.REFRESH,
      blacklisted: false,
    });

    if (!result) {
      throw new NotFoundException(AuthMessage.REFRESH_TOKEN_NOT_FOUND);
    }

    return result;
  }

  async deleteManyTokens(user: string, type: string) {
    await this.tokenModel.deleteMany({ user, type });
  }
}
