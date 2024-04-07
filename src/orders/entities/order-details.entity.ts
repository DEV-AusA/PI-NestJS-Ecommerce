import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Orders } from "./orders.entity";
import { Products } from "src/products/entities/products.entity";

@Entity({
    name: "order_details"   //* <= este  sera el nombre en la tabla de nuestra DB, se usa en plural para evitar conoflicto de nombres
})
export class OrderDetails {

    // @PrimaryColumn({ type:'uuid', unique: true, nullable: false})
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
    price: number;

    @OneToOne(() => Orders)
    @JoinColumn()  
    order_id: Orders;

    @ManyToMany(() => Products, product => product.order_details)
    @JoinTable()
    products: Products[];
}