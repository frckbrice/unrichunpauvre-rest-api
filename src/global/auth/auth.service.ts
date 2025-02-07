//src/auth/auth.service.ts
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/global/adapter/prisma-service';
import { JwtService } from '@nestjs/jwt';
import { AuthEntity } from './entities/auth.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) { }

  async login(username: string, mdpUser: string): Promise<AuthEntity> {
    // Step 1: Fetch a user with the given username
    const user = await this.prisma.user.findUnique({
      where: { username }
    });

    // If no user is found, throw an error
    if (!user?.id) {
      throw new NotFoundException(`No user found for username: ${username}`);
    }
    // console.log({ user, username, mdpUser });

    // Step 2: Check if the password is correct
    const isPasswordValid = await bcrypt.compare(mdpUser, user.mdpUser);

    // If password does not match, throw an error
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }


    // Step 3: Generate a JWT containing the user's ID and return it
    return {
      accessToken: this.jwtService.sign({
        userId: user.id,
        username: user.username,
        nomUser: user.nomUser,
        // pseudo: user.pseudo
      }),
    };
  }
}
