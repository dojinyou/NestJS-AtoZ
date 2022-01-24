import { Controller, Get, HttpException, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from 'src/http-exception.filter';
import { CatsService } from './cats.service';

@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Get()
  @UseFilters(HttpExceptionFilter)
  getAllCat() {
    throw new HttpException('api broken', 401);
    return 'get all cat api';
  }
  @Get(':id')
  getOneCat() {
    return 'get one cat api';
  }
}
