import { Module, Res } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BannerModule } from './banner/banner.module';
import { BrandModule } from './brand/brand.module';
import { CompanyModule } from './company/company.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { PartnersModule } from './partners/partners.module';
import { PostsModule } from './posts/posts.module';
import { PromotionsModule } from './promotions/promotions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    BannerModule,
    BrandModule,
    CompanyModule,
    ProductsModule,
    CategoriesModule,
    PartnersModule,
    PostsModule,
    PromotionsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
