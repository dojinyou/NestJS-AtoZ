import { Injectable } from '@nestjs/common';

@Injectable()
export class CatsService {
  getAllCats(): string {
    return 'Hello Cats!';
  }
  // getOneCats(id: number): string {
  //   return `Hello Cat ${id}`;
  // }
}
