import { join } from "path";
import { MongooseModule } from "@nestjs/mongoose";
import { I18nJsonParser, I18nModule } from "nestjs-i18n";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import { CacheInterceptor, CacheModule, Module } from "@nestjs/common";

import { AuthModule } from "modules/auth/auth.module";
import { SharedModule } from "modules/shared/shared.module";
import { ConfigService } from "modules/shared/services/config.service";
import { I18nAllExceptionFilter } from "common/filters/i18n-all-exception.filter";
import { UsersModule } from "modules/users/users.module";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => configService.mongoose,
      inject: [ConfigService],
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: (configService: ConfigService) => configService.redisConfig,
      inject: [ConfigService],
    }),
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        fallbackLanguage: configService.fallbackLanguage,
        parserOptions: {
          path: join(__dirname, "/i18n/"),
          watch: configService.isDevelopment,
        },
      }),
      parser: I18nJsonParser,
      inject: [ConfigService],
    }),
    SharedModule,
    UsersModule,
    AuthModule,
  ],
  providers: [
    { provide: APP_FILTER, useClass: I18nAllExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: CacheInterceptor },
  ],
})
export class MainModule {}
