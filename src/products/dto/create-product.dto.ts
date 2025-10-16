// src/product/dto/create-product.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import {
    IsArray,
    IsBoolean,
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsUrl,
} from 'class-validator';
import { Status } from '@prisma/client';

export class CreateProductDto {
    @ApiProperty({ description: 'Tên sản phẩm' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: 'Slug sản phẩm (duy nhất trong công ty)'})
    @IsString()
    @IsNotEmpty()
    slug: string;

    @ApiProperty({ description: 'Mô tả chi tiết về sản phẩm', required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ description: 'Trạng thái đặc biệt (HOT, NEW...)', enum: Status, required: false })
    @IsOptional()
    @IsEnum(Status)
    status?: Status;

    @ApiProperty({ description: 'Giá gốc sản phẩm'})
    @IsNumber()
    price: number;

    @ApiProperty({ description: 'Giá khuyến mãi (nếu có)', required: false })
    @IsOptional()
    @IsNumber()
    sale_price?: number;

    @ApiProperty({ description: 'Các tùy chọn khối lượng tịnh (đơn vị gram)', example: [250, 500, 1000], type: [Number] })
    @IsArray()
    @IsNumber({}, { each: true })
    net_weights: number[];

    @ApiProperty({ description: 'URL ảnh đại diện sản phẩm', required: false, type: [String] })
    @IsArray()
    @IsOptional()
    @IsUrl({require_tld: false}, {each: true})
    images?: string[];

    @ApiProperty({ description: 'Sản phẩm có phải là sản phẩm nổi bật?', example: false, default: false, required: false })
    @IsOptional()
    @IsBoolean()
    is_featured?: boolean;

    @ApiProperty({ description: 'Sản phẩm có được hiển thị công khai?', example: true, default: false, required: false })
    @IsOptional()
    @IsBoolean()
    is_published?: boolean;

    @ApiProperty({ description: 'ID của danh mục sản phẩm', example: 1, required: false })
    @IsOptional()
    @IsInt()
    categoryId?: number;

    @ApiProperty({ description: 'ID của công ty sở hữu sản phẩm', example: 1 })
    @IsInt()
    companyId: number;

    @ApiProperty({ description: 'ID của nhãn hàng', example: 1, required: false })
    @IsOptional()
    @IsInt()
    brandId?: number;
}