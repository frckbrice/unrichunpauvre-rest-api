import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';
import { Public } from 'src/global/auth/public.decorator';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) { }


  @Public()
  @Get()
  findAll() {
    return this.healthService.getHealth();
  }
}
