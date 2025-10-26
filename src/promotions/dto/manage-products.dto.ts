import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt } from 'class-validator';

export class ManageProductsDto {
  @ApiProperty({ 
    description: 'Danh sách ID sản phẩm', 
    example: [1, 2, 3], 
    type: [Number] 
  })
  @IsArray()
  @IsInt({ each: true })
  productIds: number[];
}
