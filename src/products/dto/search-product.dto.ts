import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchProductDto {
  @ApiProperty({ 
    description: 'Tìm kiếm theo tên sản phẩm (không phân biệt hoa thường)', 
    required: false,
    example: 'laptop'
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ 
    description: 'Lọc theo ID công ty', 
    required: false,
    example: 1
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  companyId?: number;

  @ApiProperty({ 
    description: 'Lọc sản phẩm đã xuất bản', 
    required: false,
    example: true
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  is_published?: boolean;

  @ApiProperty({ 
    description: 'Lọc sản phẩm nổi bật', 
    required: false,
    example: true
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  is_featured?: boolean;

  @ApiProperty({ 
    description: 'Lọc sản phẩm chưa bị xóa', 
    required: false,
    example: true,
    default: true
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  is_deleted?: boolean;
}
