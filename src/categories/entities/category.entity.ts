import { Products } from "src/products/entities/products.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name: "categories"   //* <= este  sera el nombre en la tabla de nuestra DB, se usa en plural para evitar conoflicto de nombres
})
export class Categories {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type:'varchar', length: 50, nullable: false})
    name: string;

    @ManyToOne(
        () => Products,
        (products) => products.category,
        { onDelete: 'CASCADE' } // borrar products con sus categories
    )
    @JoinColumn()
    products: Products;
}
