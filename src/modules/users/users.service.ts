import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { USERS_MODEL, UsersDocument } from "./schemas/users.schema";
import { GetUsersDto } from "./dto/get-user.dto";
import { UpdateUserInforDto } from "./dto/update-user-infor.dto";
import { PaginateModel } from "mongoose";
import { EmailLoginDto } from "modules/auth/dto/email-login.dto";
import { CreateUsersDto } from "./dto/create-users.dto";
import { validateHash } from "common/utils/bcrypt";

const USER_NOT_FOUND = "User not found";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(USERS_MODEL)
    private readonly usersModel: PaginateModel<UsersDocument>,
  ) {}
  async queryUsers(filter, options) {
    return await this.usersModel.paginate(filter, options);
  }

  async checkAuthenticatedUser(email: string) {
    const user = await this.usersModel.findOne({ email });
    if (!user.verified) {
      throw new UnauthorizedException("Verify your email first");
    }
    return user;
  }

  async verifyUser(data: EmailLoginDto): Promise<UsersDocument> {
    const { email, password } = data;
    const user = await this.usersModel.findOne({ email });

    const isPasswordValid = await validateHash(password, user?.password);

    if (!user || !isPasswordValid) {
      throw new NotFoundException("Incorrect email or password");
    }
    if (!user.verified) {
      throw new UnauthorizedException("Verify your email first");
    }
    return user;
  }

  async create(userCreate: CreateUsersDto) {
    const user = await this.usersModel.findOne({
      email: userCreate.email.toLowerCase().trim(),
    });
    if (user) {
      throw new ConflictException("User exits");
    }
    return this.usersModel.create(userCreate);
  }

  async getUsers(getUserDto: GetUsersDto) {
    const { name, role, sortBy, limit, page } = getUserDto;
    const filter = { name, role };
    const options = { sortBy, limit, page };
    return await this.usersModel.paginate(filter, options);
  }

  async getUser(id: string) {
    const user = await this.usersModel.findById(id);
    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND);
    }
    return user;
  }

  async updateUser(id: string, updateUserDto: UpdateUserInforDto) {
    const user = await this.usersModel.findOneAndUpdate(
      { _id: id },
      updateUserDto,
    );
    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND);
    }
    return user;
  }

  async getUserByEmail(email: string) {
    const user = await this.usersModel.findOne({
      email: email.toLowerCase().trim(),
    });
    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND);
    }
    return user;
  }

  async deleteUser(id: string) {
    const user = await this.usersModel.findOneAndDelete({ _id: id });
    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND);
    }
    return user;
  }
}
