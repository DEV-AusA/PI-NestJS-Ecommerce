import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductsService {

    get() {
        const products = {
            message: `Get products here.`
        }
        return products;
    }
}
