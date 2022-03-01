import { GetUsersDto } from "./dto/get-user.dto";
import {
  Controller,
  Get,
  Param,
  Post,
  HttpStatus,
  Delete,
  Put,
  Body,
  Query,
} from "@nestjs/common";
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { AuthAdmin } from "common/decorators/http.decorators";
import { CreateUsersDto } from "./dto/create-users.dto";
import { ResponseUsersDto } from "./dto/response-users.dto";
import { ErrorMessages } from "./users.constant";
import { UsersService } from "./users.service";
import { UpdateUserInforDto } from "./dto/update-user-infor.dto";

@AuthAdmin()
@ApiTags("Users")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("/manageUsers")
  @ApiOperation({ summary: `Create User` })
  @ApiOkResponse({ type: ResponseUsersDto })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ErrorMessages.USER_NOT_FOUND,
  })
  createUser(@Body() user: CreateUsersDto): Promise<ResponseUsersDto> {
    return this.usersService.create(user);
  }

  @Get("")
  @ApiOperation({ summary: `Get all users` })
  @ApiOkResponse({ type: [ResponseUsersDto] })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ErrorMessages.USER_NOT_FOUND,
  })
  getUsers(@Query() user: GetUsersDto) {
    return this.usersService.getUsers(user);
  }

  @Get("/:id")
  @ApiOperation({ summary: `Get all users` })
  @ApiOkResponse({ type: ResponseUsersDto })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ErrorMessages.USER_NOT_FOUND,
  })
  getUser(@Param() id: string) {
    return this.usersService.getUser(id);
  }

  @Put("manageUsers/:id")
  @ApiOperation({ summary: `UpdateUser` })
  @ApiOkResponse({ type: ResponseUsersDto })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ErrorMessages.USER_NOT_FOUND,
  })
  updateUser(@Param() id: string, @Body() updateUserDto: UpdateUserInforDto) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete("manageUsers/:id")
  @ApiOperation({ summary: `Delete User` })
  @ApiOkResponse({})
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ErrorMessages.USER_NOT_FOUND,
  })
  deleteUser(@Param() id: string) {
    return this.usersService.deleteUser(id);
  }
}
