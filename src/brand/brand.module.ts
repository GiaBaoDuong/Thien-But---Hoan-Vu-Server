import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
    imports: [
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'uploads'), // Đường dẫn thư mục file tĩnh 
            serveRoot: '/uploads', // URL prefix để truy cập file( ví dụ : http://localhost:8080/upload/tenfile.jpg)
            serveStaticOptions: {
                //Các tùy chọn khác nếu cần 
                index : false, // không tự động tìm file index.html

            },
        }),
    ],
  controllers: [BrandController],
  providers: [BrandService],
})
export class BrandModule {}