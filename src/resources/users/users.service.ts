
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
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

      // remove the pwd
      delete (user as { mdpUser?: string }).mdpUser;

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
        this.prismaService.user.count(),
        this.prismaService.user.findMany({}),
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

      // check if this user already exists
      const existingUser = await this.prismaService.user.findUnique({
        where: {
          username: createUserDto.username
        }
      });

      if (existingUser) {
        throw new BadRequestException(`L'utilisateur d'identifiant ${createUserDto.username} existe deja`);
      }

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

    console.log('\n\n params', data);
    try {



      // check for existing user first
      const existingUser = await this.prismaService.user.findUnique({
        where,
      })
      if (!existingUser)
        throw new Error(`L'utilisateur d'identifiant ${where?.id} n'existe pas.`);

      if (data.mdpUser) {
        data.mdpUser = await bcrypt.hash(data.mdpUser as string, roundsOfHashing);
      }

      const updatedUser = await this.prismaService.user.update({
        where,
        data: {
          ...data,
          nomUser: data?.nomUser,
          username: data?.username,
          localisation: data?.localisation,
          pieceIdf: data?.pieceIdf ?? undefined,
          pieceIdb: data?.pieceIdb ?? undefined,
          etatUser: data?.etatUser,
          dateNaiss: data?.dateNaiss,
          photoUser: data?.photoUser ?? undefined,
          mdpUser: data?.mdpUser,
          dateCrea: data?.dateCrea,
        },
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



  async patchUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput & {
      currentPasword: string;
    };
    user: User
  }): Promise<ReturnApiType<User | null>> {
    const { where, data } = params;

    console.log('\n\n params', data);
    try {

      // check for existing user first
      const existingUser = await this.prismaService.user.findUnique({
        where,
      })
      if (!existingUser)
        throw new UnauthorizedException(`L'utilisateur d'identifiant ${where?.id} n'existe pas.`);

      // verify the correspondance of the password to be sure that the user is authenticated
      const passwordMatch = await bcrypt.compare(data.currentPasword as string, existingUser.mdpUser);

      if (!passwordMatch)
        throw new UnauthorizedException(`Le mot de passe fourni n'est pas le bon`);

      // hash the new password if it exists
      if (data.mdpUser) {
        data.mdpUser = await bcrypt.hash(data.mdpUser as string, roundsOfHashing);
      }

      console.log("\n\n data: ", data);
      // remove the current password sent to replace by the new one

      const updatedUser = await this.prismaService.user.update({
        where,
        data: {
          ...existingUser,
          mdpUser: data.mdpUser,
        },
      });

      if (updatedUser) {
        console.log("\n\n new user: ", updatedUser);
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

  // hanler for forgot password
  async forgotPassword(params: {
    where: Prisma.UserWhereUniqueInput;
  }) {
    const { where } = params;

    try {
      const user = await this.prismaService.user.findUnique({
        where,
      });


      if (!user)
        throw new UnauthorizedException(`L'utilisateur d'identifiant ${where?.username} n'existe pas.`);

      // emit event to send email to the user
      return this.eventEmitter.emit(localEvents.userPasswordReset, user);
    } catch (error) {
      this.logger.error(`Error during forgot password processing of user with username  ${where?.username} \n\n ${error}`, UserService.name);
      throw new InternalServerErrorException(
        `Erreur lors de la modification du mot de passe de l'utilisateur d'identifiant ${where?.username}`,
      );
    }
  }

  // handle after the user has filled the reset-password field on form
  async resetPassword(token: string, newPassword: string, email: string) {
    try {
      // Ensure both token and new password are provided
      if (!token || !newPassword) {
        throw new BadRequestException('Missing token or password');
      }

      // Find a valid reset token (already filtering expired tokens)
      const resetToken = await this.prismaService.resetPassword.findFirst({
        where: {
          token,
          expiration: { gt: new Date() } // Ensures token is not expired
        },
      });

      if (!resetToken) {
        throw new NotFoundException('Invalid or expired token');
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update user password
      await this.prismaService.user.update({
        where: { username: email },
        data: { mdpUser: hashedPassword },
      });

      // Invalidate the reset token (to prevent reuse)
      await this.prismaService.resetPassword.delete({
        where: { id: resetToken.id },
      });

      return {
        message: 'Password reset successful',
        status: 200, // Use 200 to indicate success since you're returning a message
      };
    } catch (error) {
      this.logger.error(`Error during reset password processing \n\n ${error}`, UserService.name);
      throw new InternalServerErrorException('Error durant la modification du mot de passe');
    }
  }

}
