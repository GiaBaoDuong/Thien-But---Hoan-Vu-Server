import { PartialType } from '@nestjs/mapped-types';
import { CreateBrandDto } from 'src/brand/dto/create-brand.dto';

export class UpdateBrandDto extends PartialType(CreateBrandDto){}
