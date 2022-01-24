import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { CatsService } from './cats/cats.service';
import { PositiveIntPipe } from './positive-int.pipe';

@Controller('home')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly catService: CatsService,
  ) {}

  @Get()
  getCatsHello(): string {
    return this.catService.getAllCats();
  }

  @Get(':id')
  getOneCat(@Param('id', ParseIntPipe, PositiveIntPipe) id): string {
    console.log(typeof id); // string -> number
    return 'One Cats';
  }
}
