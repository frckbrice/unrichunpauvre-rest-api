
import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  Query,
  Patch,
} from '@nestjs/common';
import { UserService } from './users.service';
import { Prisma, User as UserModel } from '@prisma/client';
import { UserPaginationParams } from 'src/global/utils/pagination';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) { }

  @Post('user')
  async signupUser(
    @Body() userData: Prisma.UserCreateInput,
  ): Promise<UserModel> {
    return this.userService.createUser(userData);
  }


  @Get()
  findAll(@Query() params: UserPaginationParams) {
    return this.userService.findAllUsers(params);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findSingleUser({ id });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: Prisma.UserUpdateInput) {
    return this.userService.updateUser({ where: { id }, data: updateUserDto });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.deleteUser({ id });
  }


}
