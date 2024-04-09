import { Categories } from "src/categories/entities/category.entity";
import { OrderDetails } from "src/orders/entities/order-details.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name: "products"   //* <= este  sera el nombre en la tabla de nuestra DB, se usa en plural para evitar conoflicto de nombres
})
export class Products {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type:'varchar', unique: true, length: 50, nullable: false })
    name: string;

    @Column({ type:'varchar', nullable: false })
    description: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
    price: number;

    @Column({ type:'integer', nullable: false })
    stock: number;

    @Column({ type:'varchar', default: 'https://gesisarg.com/sistema-gestion/res/archivos/imagen_articulo_por_defecto.jpg' })
    img_url: string;

    @OneToMany(
        () => Categories,
        (category) => category.products,
        { cascade: true, eager: true }
     )
    @JoinColumn()
    category: Categories[];

    @ManyToMany(() => OrderDetails, orderDetail => orderDetail.products)
    @JoinTable({
        name: 'order_details_products'
    })
    order_details: OrderDetails[];
}