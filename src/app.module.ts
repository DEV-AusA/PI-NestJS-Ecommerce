import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from './categories/categories.module';
import { OrdersModule } from './orders/orders.module';
import typeormConfig from 'config/typeorm.config';
import { DataLoaderService } from './helpers/preload.data.helper';
import { User } from './users/entities/user.entity';
import { FilesModule } from './files/files.module';
import { JwtModule } from '@nestjs/jwt';
import { Products } from './products/entities/products.entity';
import { configJwt } from "../config/jwt.config";

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
    TypeOrmModule.forFeature([User, Products]), // preload data categories
    UsersModule, ProductsModule, AuthModule, CategoriesModule, OrdersModule, FilesModule,
    JwtModule.register( configJwt )
  ],
  controllers: [],
  providers: [DataLoaderService], // preload data DataLoaderService
})
export class AppModule {}
