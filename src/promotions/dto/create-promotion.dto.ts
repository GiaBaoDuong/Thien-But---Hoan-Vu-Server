import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsBoolean,
    IsDate,
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';

export enum DiscountType {
    PERCENTAGE = 'PERCENTAGE',
    FIXED_AMOUNT = 'FIXED_AMOUNT',
}
export class CreatePromotionDto {
    @ApiProperty({ description: 'Tên chương trình khuyến mãi: ' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: 'Mô tả chương trình khuyến mãi: ', required: false})
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({description: 'Loại giảm giá: ', enum: DiscountType, example: DiscountType.PERCENTAGE})
    @IsEnum(DiscountType)
    discountType: DiscountType;

    @ApiProperty({description: 'Giá trị giảm giá(theo loại giảm giá): ' })
    @Type(() => Number)
    @IsNumber()
    discountValue: number;

    @ApiProperty({description: 'Ngày bắt đầu giảm giá: '})
    @Type(() => Date)
    @IsDate()
    startDate: Date;

    @ApiProperty({description: 'Ngày kết thúc giảm giá: '})
    @Type(() => Date)
    @IsDate()
    endDate: Date;

    @ApiProperty({description: 'Trạng thái kích hoạt khuyến mãi: ', example: true, required: false})
    @IsOptional()
    @IsBoolean()
    isActive?: boolean; 

    @ApiProperty({ description: 'Id công ty sở hữu khuyến mãi: ', example: 1})
    @Type(() => Number)
    @IsInt()
    companyId: number;
    


    @ApiProperty({ description: 'Danh sách productId áp dụng khuyến mãi : ', required: false, type:[Number] })
    @IsOptional()
    @IsInt({ each: true}) 
    productIds: number[];

}
