import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from "@nestjs/common";
import { Injectable } from "@nestjs/common";
import { UsersDocument } from "modules/users/schemas/users.schema";

import { ContextProvider } from "../providers/context.provider";

@Injectable()
export class AuthUserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();

    const user = <UsersDocument>request.user;
    ContextProvider.setAuthUser(user);

    return next.handle();
  }
}
