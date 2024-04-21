import { Injectable, InternalServerErrorException } from "@nestjs/common";
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
}