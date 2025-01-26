
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/global/adapter/prisma-service';
import { User, Prisma } from '@prisma/client';
import { UserPaginationParams } from 'src/global/utils/pagination';
import { LoggerService } from 'src/global/logger/logger.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { localEvents } from 'src/global/share/events/event-list';
import { ReturnApiType } from 'src/global/utils/return-type';
import * as bcrypt from 'bcrypt';

export const roundsOfHashing = 10;

@Injectable()
export class UserService {
  private readonly logger = new LoggerService(UserService.name);

  constructor(
    private prismaService: PrismaService,
    private eventEmitter: EventEmitter2,
  ) { }

  async findSingleUser(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<ReturnApiType<User | null>> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: userWhereUniqueInput,
      });
      if (!user) {
        return {
          status: 400,
          message: 'User not found',
          data: null,
        }
      }
      return {
        status: 200,
        message: 'User found',
        data: user,
      };

    } catch (error) {
      this.logger.error(
        `Error while fetching user with id ${userWhereUniqueInput.id} \n\n ${error}`,
        UserService.name,
      );
      throw new InternalServerErrorException(
        `Erreur de recherche de l\'utilisateur d\'identifiant` + userWhereUniqueInput.id,
      );
    }
  }

  async findAllUsers(params: UserPaginationParams) {
    const { page, perPage, cursor, orderBy } = params;

    try {
      const [total, pubs] = await this.prismaService.$transaction([
        this.prismaService.publication.count(),
        this.prismaService.publication.findMany({}),
      ]);
      if (typeof pubs != 'undefined' && pubs.length) {
        return {
          status: 200,
          message: 'les utilisateurs ont ete recherchees avec succes!',
          data: pubs,
          total,
          page: Number(page) || 0,
          perPage: Number(perPage) ?? 20 - 1,
          totalPages: Math.ceil(total / (Number(perPage) ?? 20 - 1)),
        };
      }
      return {
        status: 400,
        message: 'les utilisateurs n\'ont pas ete trouvees',
        data: [],
        total,
        page: Number(page) || 0,
        perPage: Number(perPage) ?? 20 - 1,
        totalPages: Math.ceil(total / (Number(perPage) ?? 20 - 1)),
      };

    } catch (error) {
      this.logger.error(
        `Error while fetching users \n\n ${error}`,
        UserService.name,
      );
      throw new InternalServerErrorException('Erreur de recherche des utilisateurs');
    }

  }

  async createUser(createUserDto: Prisma.UserCreateInput): Promise<ReturnApiType<User>> {

    try {
      const hashedPassword = await bcrypt.hash(
        createUserDto.mdpUser,
        roundsOfHashing,
      );

      createUserDto.mdpUser = hashedPassword;

      const newUser = await this.prismaService.user.create({
        data: createUserDto,
      });

      if (newUser) {
        console.log('\n\n newUser', newUser);

        // send message for company created in senwisetool system
        this.eventEmitter.emit(localEvents.userCreated, newUser);
        return {
          status: 201,
          message: `L\'utilisateur ${newUser.nomUser} a ete cree avec success`,
          data: newUser,
        }
      }

      else
        return {
          status: 400,
          message: `L\'utilisateur ${createUserDto?.nomUser} n\'a pas ete cree`,
          data: newUser,
        }

    } catch (error) {
      this.logger.error(
        `Error while creating company ${createUserDto.nomUser} \n\n ${error}`,
        UserService.name,
      );
      throw new InternalServerErrorException(
        `Erreur de creation de l\'utilisateur ` + createUserDto.nomUser,
      );
    }

  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<ReturnApiType<User | null>> {
    const { where, data } = params;
    try {

      if (data.mdpUser) {
        data.mdpUser = await bcrypt.hash(data.mdpUser as string, roundsOfHashing);
      }

      const updatedUser = await this.prismaService.user.update({
        where,
        data,
      });

      if (updatedUser) {
        // send message for company created in senwisetool system
        this.eventEmitter.emit(localEvents.userUpdated, updatedUser);
        return {
          status: 204,
          message: `L'utilisateur ${updatedUser.nomUser} a ete modifie avec success`,
          data: null,
        }
      }
      else
        return {
          status: 400,
          message: `L'utilisateur ${data?.nomUser} n'a pas ete modifie`,
          data: null,
        }

    } catch (error) {
      this.logger.error(
        `Error while updating user ${data.nomUser} \n\n ${error}`,
        UserService.name,
      );
      throw new InternalServerErrorException(
        `Erreur de modification de l\'utilisateur ` + data.nomUser,
      );
    }

  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<ReturnApiType<User | null>> {
    try {
      const deletedUser = await this.prismaService.user.delete({
        where,
      });

      if (deletedUser)
        return {
          status: 204,
          message: `L'utilisateur ${deletedUser.nomUser} a ete supprime avec success`,
          data: null,
        }
      else
        return {
          status: 400,
          message: `L'utilisateur d\'identifiant ${where?.id} n'a pas ete supprime`,
          data: null,
        }
    } catch (error) {
      this.logger.error(`Error during processing ${where?.id} \n\n ${error}`, UserService.name);
      throw new InternalServerErrorException(
        `Erreur de suppression de l'utilisateur d'identifiant ${where?.id}`,
      );
    }
  }
}
