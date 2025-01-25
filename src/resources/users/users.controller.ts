
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
import { Prisma, User as UserModel } from '@prisma/client';
import { UserPaginationParams } from 'src/global/utils/pagination';
import { ReturnApiType } from 'src/global/utils/return-type';
import { JwtAuthGuard } from '../../global/auth/jwt-auth.guard';
import { ApiCreatedResponse, ApiOkResponse, ApiTags, ApiBearerAuth, } from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';
import { Public } from '../../global/auth/public.decorator';

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
  ): Promise<ReturnApiType<UserModel>> {
    return this.userService.createUser(userData);
  }


  @Get()
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

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: UserEntity })
  update(@Param('id') id: string, @Body() updateUserDto: Prisma.UserUpdateInput) {
    return this.userService.updateUser({ where: { id }, data: updateUserDto });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  remove(@Param('id') id: string) {
    return this.userService.deleteUser({ id });
  }


}
