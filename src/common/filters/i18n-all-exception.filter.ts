import { I18nService } from "nestjs-i18n";
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from "@nestjs/common";
import { Response, Request } from "express";
import { LanguageCode } from "common/constants/language";
import { IExceptionErrorMessage } from "common/interfaces/exception";

@Catch(HttpException)
export class I18nAllExceptionFilter implements ExceptionFilter {
  constructor(private readonly i18n: I18nService) {}

  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const statusCode = exception.getStatus();

    const langData = <LanguageCode>ctx.getRequest<Request>().headers.lang;
    const lang = Object.values(LanguageCode).includes(langData)
      ? langData
      : LanguageCode.English;

    const messageRes = <string | IExceptionErrorMessage>exception.getResponse();

    if (
      Array.isArray((<IExceptionErrorMessage>messageRes)?.message) ||
      typeof messageRes === "string" ||
      !Object.prototype.hasOwnProperty.call(messageRes, "key")
    ) {
      return response.status(statusCode).json({
        statusCode,
        message:
          typeof messageRes === "string" ? messageRes : messageRes.message,
        error: (<IExceptionErrorMessage>messageRes)?.error,
      });
    }

    const message = await this.i18n.translate(messageRes.key, {
      lang,
      args: messageRes.args,
    });

    return response.status(statusCode).json({ statusCode, message });
  }
}
