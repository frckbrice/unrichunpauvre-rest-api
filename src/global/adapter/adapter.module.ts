import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma-service';

@Global() // set the module globally
@Module({
    providers: [PrismaService],
    exports: [PrismaService],
})
export class PrismaModule { }
