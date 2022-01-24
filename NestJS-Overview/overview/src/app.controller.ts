import { Body, Controller, Get, Param, Req } from '@nestjs/common';
import { Request } from 'express';
import { AppService } from './app.service';
import { CatsService } from './cats/cats.service';

@Controller('home')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly catService: CatsService,
  ) {}

  @Get()
  getCatsHello(): string {
    return this.catService.getCats();
  }

  @Get(':id')
  getHello(@Req() Req: Request, @Body() Body, @Param() Param): string {
    return this.appService.getHello();
  }
}
