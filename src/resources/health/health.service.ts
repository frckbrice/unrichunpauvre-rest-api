import { Injectable } from '@nestjs/common';


@Injectable()
export class HealthService {

  getHealth(): string {
    return '1Riche1pauvre server is running!!!!';
  }

}
