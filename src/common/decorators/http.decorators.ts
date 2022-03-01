import type { PipeTransform } from "@nestjs/common";
import {
  applyDecorators,
  Param,
  ParseUUIDPipe,
  SetMetadata,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import type { Type } from "@nestjs/common/interfaces";
import { ApiBearerAuth, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { RoleType } from "common/constants/role-type";

import { AuthUserInterceptor } from "../interceptors/auth-user-interceptor.service";
import { PublicRoute } from "./public-route.decorator";
import { AuthGuard } from "common/guards/auth.guard";
import { RolesGuard } from "common/guards/roles.guard";

export function Auth(
  roles: RoleType[] = Object.values(RoleType),
  options?: Partial<{ public: boolean }>,
): MethodDecorator & ClassDecorator {
  const isPublicRoute = options?.public;

  return applyDecorators(
    SetMetadata("roles", roles),
    UseGuards(AuthGuard({ public: isPublicRoute }), RolesGuard),
    ApiBearerAuth(),
    UseInterceptors(AuthUserInterceptor),
    ApiUnauthorizedResponse({ description: "Unauthorized" }),
    PublicRoute(isPublicRoute),
  );
}

export function UUIDParam(
  property: string,
  ...pipes: Array<Type<PipeTransform> | PipeTransform>
): ParameterDecorator {
  return Param(property, new ParseUUIDPipe({ version: "4" }), ...pipes);
}

export function AuthAdmin(
  roles: RoleType[] = [RoleType.ADMIN],
  options?: Partial<{ public: boolean }>,
): MethodDecorator & ClassDecorator {
  return Auth(roles, options);
}
