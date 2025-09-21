import { ApiProperty } from '@nestjs/swagger';
import{ Type } from 'class-transformer';
import {
    IsBoolean,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUrl,
} from 'class-validator';
export class CreateCategoryDto {
    @ApiProperty({description: 'Tên danh mục'})
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: 'Đường dẫn tĩnh (slug) của danh mục', required: false})
    @IsOptional()
    @IsString()
    slug?: string;

    @ApiProperty({ description: 'Mô tả về danh mục', required: false})
    @IsOptional()
    @IsString()
    description?: string;
}
