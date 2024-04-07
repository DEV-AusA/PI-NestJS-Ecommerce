import { Controller, Get, Post, Body } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService) {}
  
  @Get()
  getCategories() {
    return this.categoriesService.getCategories();
  }

  @Post('seeder')
  addCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.addCategory(createCategoryDto);
  }

}
