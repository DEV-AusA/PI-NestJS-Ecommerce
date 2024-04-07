import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoriesRepository } from './categories.repository';
// import * as preloadProductsData from '../helpers/decode-basic-auth.helper'; // archivo preload json

@Injectable()
export class CategoriesService {
  constructor(
    private readonly categoriesRepository: CategoriesRepository){}

  // async seedCategories() {
  //   const categories = preloadProductsData; // Carga las categorías desde el archivo JSON
  //   await Promise.all(categories.map(category => this.addCategory(category)));
  // }
  
  getCategories() {
    return this.categoriesRepository.getCategories();
  }

  addCategory(createCategoryDto: CreateCategoryDto) {
    return this.categoriesRepository.addCategory(createCategoryDto);
  }

}
