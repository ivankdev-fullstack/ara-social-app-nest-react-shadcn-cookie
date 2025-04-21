import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/healthcheck')
  healthcheck(): boolean {
    return true;
  }
}
