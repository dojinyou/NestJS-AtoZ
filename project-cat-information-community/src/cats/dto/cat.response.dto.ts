import { ApiProperty, PickType } from '@nestjs/swagger';
import { Cat } from '../cats.schema';

export class CatResponsetDto extends PickType(Cat, ['email', 'name'] as const) {
  @ApiProperty({
    example: '12312312312',
    description: 'id',
  })
  id: string;
}
