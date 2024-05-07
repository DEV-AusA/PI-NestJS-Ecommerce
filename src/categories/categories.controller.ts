import { Controller, Get } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'Lista de categorias disponibles.' })
  getCategories() {
    return this.categoriesService.getCategories();
  }
}
