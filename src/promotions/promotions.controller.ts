import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query } from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { ManageProductsDto } from './dto/manage-products.dto';
import { SearchPromotionDto } from './dto/search-promotion.dto';

@Controller('promotions')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Post()
  create(@Body() createPromotionDto: CreatePromotionDto) {
    return this.promotionsService.create(createPromotionDto);
  }

  @Get()
  findAll() {
    return this.promotionsService.findAll();
  }

  @Get('search')
  search(@Query() searchDto: SearchPromotionDto) {
    return this.promotionsService.search(searchDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.promotionsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePromotionDto: UpdatePromotionDto) {
    return this.promotionsService.update(+id, updatePromotionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.promotionsService.remove(+id);
  }

  // Thêm products vào promotion
  @Put(':id/products')
  addProducts(@Param('id') id: string, @Body() manageProductsDto: ManageProductsDto) {
    return this.promotionsService.addProducts(+id, manageProductsDto.productIds);
  }

  // Xóa products khỏi promotion
  @Delete(':id/products')
  removeProducts(@Param('id') id: string, @Body() manageProductsDto: ManageProductsDto) {
    return this.promotionsService.removeProducts(+id, manageProductsDto.productIds);
  }

  // Lấy danh sách products trong promotion
  @Get(':id/products')
  getProducts(@Param('id') id: string) {
    return this.promotionsService.getProducts(+id);
  }
}
