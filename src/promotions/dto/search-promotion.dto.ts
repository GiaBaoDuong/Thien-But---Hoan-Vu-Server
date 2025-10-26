import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, IsBoolean, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchPromotionDto {
  @ApiProperty({ 
    description: 'Tìm kiếm theo tên promotion (không phân biệt hoa thường)', 
    required: false,
    example: 'khuyến mãi'
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
    description: 'Lọc promotion đang active', 
    required: false,
    example: true
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ 
    description: 'Lọc promotion theo ngày bắt đầu (từ ngày)', 
    required: false,
    example: '2024-01-01'
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDateFrom?: Date;

  @ApiProperty({ 
    description: 'Lọc promotion theo ngày bắt đầu (đến ngày)', 
    required: false,
    example: '2024-12-31'
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDateTo?: Date;

  @ApiProperty({ 
    description: 'Lọc promotion theo ngày kết thúc (từ ngày)', 
    required: false,
    example: '2024-01-01'
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDateFrom?: Date;

  @ApiProperty({ 
    description: 'Lọc promotion theo ngày kết thúc (đến ngày)', 
    required: false,
    example: '2024-12-31'
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDateTo?: Date;
}
