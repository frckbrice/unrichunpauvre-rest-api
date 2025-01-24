import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { LoggerService } from 'src/global/logger/logger.service';
import { PrismaService } from '../adapter/prisma-service';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector, private prismaService: PrismaService) { }
    private readonly logger = new LoggerService(RolesGuard.name);
    canActivate(context: ExecutionContext): boolean {


        // we make sure the user is connected and authenticated
        const { user } = context.switchToHttp().getRequest();


        // allow route access for public routes like : health check etc.
        if (!user) {
            this.logger.log('user allowed access to route handler', RolesGuard.name);
            return false;
        }

        return true;
    }
}
