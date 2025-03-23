
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
  UseGuards,
} from '@nestjs/common';
import { UserService } from './users.service';
import { Prisma, User, User as UserModel } from '@prisma/client';
import { UserPaginationParams } from 'src/global/utils/pagination';
import { ReturnApiType } from 'src/global/utils/return-type';
import { JwtAuthGuard } from '../../global/auth/jwt-auth.guard';
import { ApiCreatedResponse, ApiOkResponse, ApiTags, ApiBearerAuth, ApiResponse, } from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';
import { Public } from '../../global/auth/public.decorator';
import { CurrentUser } from 'src/global/auth/current-user';

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) { }

  @Public() // explicitely set this method as public
  @Post('signup')
  @ApiCreatedResponse({ type: UserEntity })
  async signupUser(
    @Body() userData: Prisma.UserCreateInput,
  ) {

    return this.userService.createUser(userData);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity, isArray: true })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity, isArray: true })
  findAll(@Query() params: UserPaginationParams) {
    return this.userService.findAllUsers(params);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  findOne(@Param('id') id: string) {
    return this.userService.findSingleUser({ id });
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: UserEntity })
  update(@Param('id') id: string, @Body() updateUserDto: Prisma.UserUpdateInput) {
    return this.userService.updateUser({ where: { id }, data: updateUserDto });
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: UserEntity })
  patchUser(
    @Param('id') id: string,
    @Body() updateUserDto: Prisma.UserUpdateInput & {
      currentPasword: string;
    },
    @CurrentUser() user: User
  ) {
    return this.userService.patchUser({ where: { id }, data: updateUserDto, user });
  }

  // forgot password
  @Public() // explicitely set this method as public
  @Post('forgot-password')
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: UserEntity })
  forgotPassword(@Body() { username }: { username: string }) {

    console.log("\n\n updateUserDto: ", { username });
    return this.userService.forgotPassword({ where: { username: <string>username } });
  }


  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  remove(
    @Param('id') id: string,
    //  @Body() { username }: { username?: string }
  ) {

    // const where = {};
    // if (username)
    //   where['username'] = username;
    // else
    //   where['id'] = id;
    return this.userService.deleteUser({ id });
  }

  @Public()
  @Post('reset-password')
  @ApiOkResponse({ type: UserEntity })
  @ApiResponse({ status: 204, description: 'No Content, for successfull password reset' })
  async resetPassword(@Body() data: { token: string; password: string, email: string }) {
    const { token, password, email } = data;
    return this.userService.resetPassword(token, password, email);
  }

}
