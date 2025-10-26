import { ProductsService } from './products.service';
import { Get, Body, Controller, Delete, Post, UploadedFile, UploadedFiles, UseInterceptors, Query, Put, Param } from "@nestjs/common";
import { Product } from "./entities/product.entity";
import { CreateProductDto } from "./dto/create-product.dto";
import { SearchProductDto } from "./dto/search-product.dto";
import { extname } from 'path';
import { diskStorage } from 'multer';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { v4 as uuidv4 } from 'uuid';
import { ApiBody, ApiConsumes, ApiProperty } from '@nestjs/swagger';
import { Public } from 'src/helper/public.decorator';
import { UpdateProductDto } from './dto/update-product.dto';
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('create')
  @UseInterceptors(FilesInterceptor('files')) // Tên field là 'files'
  async create(@Body() createProductDto: CreateProductDto, @UploadedFiles() files: Array<Express.Multer.File>) {
    return this.productsService.create(createProductDto);
  }

  @Post('upload/images')
  @ApiConsumes('multipart/form-data') // Báo cho Swagger endpoint này nhận form-data
    @ApiBody({
      description: 'Upload nhiều file ảnh (tối đa 10)',
      schema: {
        type: 'object',
        properties: {
          productId: { type: 'number', description: 'ID sản phẩm', example: 1 },
          // Tên thuộc tính phải trùng với tên field trong FilesInterceptor
          files: {
            type: 'array', // Khai báo đây là một mảng
            items: {
              type: 'string',
              format: 'binary', // Mỗi phần tử trong mảng là một file
            },
          },
        },
      },
    })
  @UseInterceptors(FilesInterceptor('files', 5, {
    storage: diskStorage({
      destination: './uploads/productsImages', // lưu file vào thư mục uploads
      filename: (req, file, cb) => {
        // Sinh tên file duy nhất sử dụng UUID
        const uniqueSuffix = uuidv4();
        const fileExtName = extname(file.originalname);
        cb(null, `${uniqueSuffix}${fileExtName}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      // Chỉ cho phép upload các file ảnh (jpeg, jpg, png, gif)
      if (!file.mimetype.match(/\/(jpeg|jpg|png|gif)$/)) {
        return cb(new Error('Chỉ hỗ trợ upload file ảnh (jpeg, jpg, png, gif)!'), false);
      }
      cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 } // giới hạn kích thước file tối đa 5MB
  }))
  async uploadMultipleFiles(@UploadedFiles() files: Array<Express.Multer.File>, @Body('productId') productId: number,) {
    if(!productId){
      throw new Error('productId là bắt buộc');
    }

    //Kiểm tra Product có tồn tại không trước khi upload ảnh 
    const product = await this.productsService.findOne(+productId);
    if(!product){
      throw new Error('Không tìm thấy sản phẩm với ID = ${productId}');
    }
    const baseUrl = process.env.BASE_URL || 'http://localhost:8080';
    const fileUrls = files.map(file => `${baseUrl}/uploads/productsImages/${file.filename}`);

    await this.productsService.addImagesToProduct(+productId, fileUrls);
    return {
      message: 'Upload ảnh thành công',
      productId,
      images: fileUrls,

    };
  }

  @Get()
  @Public()
  findAll(){
    return this.productsService.findAll();
  }

  @Get('search')
  @Public()
  search(@Query() searchDto: SearchProductDto) {
    return this.productsService.search(searchDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string){
    return this.productsService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto){
    return this.productsService.update(+id, updateProductDto);  
  }

  @Delete(':id')
  remove(@Param('id') id: string){
    return this.productsService.remove(+id);
  }

  @Get(':id/images')
  getProductImages(@Param('id') id: string) {
    return this.productsService.getImagesByProductId(+id);
  }



}
