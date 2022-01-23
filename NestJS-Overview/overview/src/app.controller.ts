import { Body, Controller, Get, Param, Req } from '@nestjs/common';
import { Request } from 'express';
import { AppService } from './app.service';

@Controller('home')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(':id')
  getHello(@Req() Req: Request, @Body() Body, @Param() Param): string {
    console.log('🚀 ~ file: app.controller.ts ~ line 11 ~  Param', Param);
    console.log('🚀 ~ file: app.controller.ts ~ line 11 ~ Body', Body);
    console.log('🚀 ~ file: app.controller.ts ~ line 11 ~ Req', Req);
    return this.appService.getHello();
  }
}
