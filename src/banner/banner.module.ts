import { Module } from '@nestjs/common';
import { BannerService } from './banner.service';
import { BannerController } from './banner.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // Đường dẫn thư mục file tĩnh
      serveRoot: '/uploads', // URL prefix để truy cập file (ví dụ: http://localhost:3000/upload/tenfile.jpg)
      serveStaticOptions: {
        // Các tùy chọn khác nếu cần
        index: false, // Không tự động tìm file index.html
      },
    }),
  ],
  controllers: [BannerController],
  providers: [BannerService],
})
export class BannerModule { }
