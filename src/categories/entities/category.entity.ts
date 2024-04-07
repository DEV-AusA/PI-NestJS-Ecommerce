import { Products } from "src/products/entities/products.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name: "categories"   //* <= este  sera el nombre en la tabla de nuestra DB, se usa en plural para evitar conoflicto de nombres
})
export class Category {

    // @PrimaryColumn({ type:'uuid', unique: true, nullable: false})
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type:'varchar', length: 50, nullable: false, unique: true})
    name: string;

    @OneToOne(() => Products)
    @JoinColumn()  
    products: Products;
}
