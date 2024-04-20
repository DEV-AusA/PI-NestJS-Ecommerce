import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from './categories/categories.module';
import { OrdersModule } from './orders/orders.module';
import typeormConfig from '../config/typeorm.config';
import { DataLoaderService } from './helpers/preload.data.helper';
import { User } from './users/entities/user.entity';
import { FilesModule } from './files/files.module';
import { JwtModule } from '@nestjs/jwt';
import { Products } from './products/entities/products.entity';
import { configJwt } from "../config/jwt.config";
import { SeedModule } from './seed/seed.module';
import { ConsultsModule } from './consults/consults.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    UsersModule, ProductsModule, AuthModule, CategoriesModule, OrdersModule, FilesModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeormConfig]
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => configService.get('typeorm'),
    }),
    TypeOrmModule.forFeature([User, Products]), // preload data categories
    JwtModule.register( configJwt ), // jwt.config
    SeedModule, //sed module
    ConsultsModule, // consult module AI
    AdminModule,    
  ],
  controllers: [],
  providers: [DataLoaderService], // preload data DataLoaderService
})
export class AppModule {}
