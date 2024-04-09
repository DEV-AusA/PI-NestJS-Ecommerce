import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from './categories/categories.module';
import { OrdersModule } from './orders/orders.module';
import typeormConfig from 'config/typeorm.config';
import { DataLoaderService } from './helpers/preloa-data';
import { Categories } from './categories/entities/category.entity';
import { User } from './users/entities/user.entity';
import { FilesModule } from './files/files.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeormConfig]
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => configService.get('typeorm'),
    }),
    TypeOrmModule.forFeature([User, Categories]), // preload data categories
    UsersModule, ProductsModule, AuthModule, CategoriesModule, OrdersModule, FilesModule],
  controllers: [],
  providers: [DataLoaderService], // preload data DataLoaderService
})
export class AppModule {}
