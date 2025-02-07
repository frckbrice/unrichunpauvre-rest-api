import { Injectable } from '@nestjs/common';
import { PrismaService } from './global/adapter/prisma-service'; // Assuming you're using Prisma for database
import * as bcrypt from 'bcrypt';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) { }

  async resetPassword(email: string, token: string, newPassword: string): Promise<boolean> {
    // Check if the reset token exists and is valid
    try {
      const resetEntry = await this.prisma.resetPassword.findFirst({
        where: { email, token, expiration: { gt: new Date() } }, // Ensure it's not expired
      });

      if (!resetEntry) {
        return false; // Invalid token or expired
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update the user's password
      await this.prisma.user.update({
        where: { username: email },
        data: { mdpUser: hashedPassword },
      });

      // Delete the reset token to prevent reuse
      await this.prisma.resetPassword.deleteMany({ where: { token } });

      return true;
    } catch (error) {
      console.error("\n\n Error :", error)
      return false;
    }
  }
}
