import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Categories } from "./entities/category.entity";
import { Repository } from "typeorm";

@Injectable()
export class CategoriesRepository {

    constructor(
        @InjectRepository(Categories)
        private readonly categoriesRepository: Repository<Categories>,
    ) {}

    async getCategories() {
        try {
            const categories = await this.categoriesRepository.find()
            return categories;
            
        } catch (error) {
            throw new InternalServerErrorException(error.message)
        }
    }
    
    async addCategory(createCategoryDto: CreateCategoryDto) {

        try {
            const newCategory = this.categoriesRepository.create(createCategoryDto);
            await this.categoriesRepository.save(newCategory);
            return newCategory;
            
        } catch (error) {
            throw new InternalServerErrorException(error.driverError.detail);            
        }
    }
}