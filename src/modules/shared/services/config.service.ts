import { CacheModuleOptions, Injectable } from "@nestjs/common";
import { isNil } from "lodash";
import { ConfigService as NestConfigService } from "@nestjs/config";
import { MongooseModuleOptions } from "@nestjs/mongoose";
import * as mongoosePaginate from "mongoose-paginate-v2";
import * as aggregatePaginate from "mongoose-aggregate-paginate-v2";
import * as redisStore from "cache-manager-redis-store";

@Injectable()
export class ConfigService {
  constructor(private configService: NestConfigService) {}

  get isDevelopment(): boolean {
    return this.nodeEnv === "development";
  }

  get isProduction(): boolean {
    return this.nodeEnv === "production";
  }

  get isTest(): boolean {
    return this.nodeEnv === "test";
  }

  get nodeEnv(): string {
    return this.getString("NODE_ENV");
  }

  get port(): number {
    return this.getNumber("PORT");
  }

  get fallbackLanguage(): string {
    return "en";
  }

  get jwt() {
    return {
      secret: this.getString("JWT_SECRET"),
      accessExpirationMinutes: this.getNumber("JWT_ACCESS_EXPIRATION_MINUTES"),
      refreshExpirationDays: this.getNumber("JWT_REFRESH_EXPIRATION_DAYS"),
      resetPasswordExpirationMinutes: this.getNumber(
        "JWT_RESET_PASSWORD_EXPIRATION_MINUTES",
      ),
      verifyEmailExpirationMinutes: this.getNumber(
        "JWT_VERIFY_EMAIL_EXPIRATION_MINUTES",
      ),
    };
  }

  get mongoose(): MongooseModuleOptions {
    return {
      uri: this.getString("MONGODB_URL"),
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectionFactory: (connection) => {
        connection.plugin(mongoosePaginate);
        connection.plugin(aggregatePaginate);
        return connection;
      },
    };
  }

  get redisConfig(): CacheModuleOptions {
    return {
      store: redisStore,
      url: this.getString("REDIS_URI"),
      prefix: `metaxy_admin_api_${this.nodeEnv}_`,
    };
  }

  get authConfig() {
    return {
      jwtSecret: this.getString("JWT_SECRET_KEY"),
      jwtExpirationTime: this.getNumber("JWT_EXPIRATION_TIME"),
    };
  }

  private get(key: string): string {
    const value = this.configService.get(key);

    if (isNil(value)) {
      throw new Error(key + " environment variable does not set");
    }

    return value;
  }

  private getNumber(key: string): number {
    const value = this.get(key);

    try {
      return Number(value);
    } catch {
      throw new Error(key + " environment variable is not a number");
    }
  }

  private getBoolean(key: string): boolean {
    const value = this.get(key);

    try {
      return Boolean(JSON.parse(value));
    } catch {
      throw new Error(key + " env var is not a boolean");
    }
  }

  private getString(key: string): string {
    const value = this.get(key);

    return value.replace(/\\n/g, "\n");
  }
}
