import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoriesRepository } from './categories.repository';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly categoriesRepository: CategoriesRepository){}
  
  getCategories() {
    return this.categoriesRepository.getCategories();
  }

  addCategory(createCategoryDto: CreateCategoryDto) {
    return this.categoriesRepository.addCategory(createCategoryDto);
  }

}
