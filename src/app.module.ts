import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ProductsController } from './products/products.controller';
import { ProductsService } from './products/products.service';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UsersModule, ProductsModule, AuthModule],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class AppModule {}
