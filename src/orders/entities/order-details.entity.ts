import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Orders } from "./orders.entity";
import { Products } from "../../products/entities/products.entity";

@Entity({
    name: "order_details"   //* <= este  sera el nombre en la tabla de nuestra DB, se usa en plural para evitar conoflicto de nombres
})
export class OrderDetails {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
    price: number;

    @OneToOne(() => Orders, order => order.order_details)
    @JoinColumn()  
    order_id: Orders;

    @ManyToMany(
        () => Products, products => products.order_details,
        {cascade: true, eager: true}
    )
    @JoinTable({
        name: 'order_details_products'
    })
    products: Products[];
}