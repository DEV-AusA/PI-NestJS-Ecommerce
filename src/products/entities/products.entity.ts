import { Category } from "src/categories/entities/category.entity";
import { OrderDetails } from "src/orders/entities/order-details.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name: "products"   //* <= este  sera el nombre en la tabla de nuestra DB, se usa en plural para evitar conoflicto de nombres
})
export class Products {

    // @PrimaryColumn({ type:'uuid', unique: true, nullable: false})
    @PrimaryGeneratedColumn('uuid')
    id: number;

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

    @OneToMany( () => Category, ((category) =>category.id))
    category_id: Category[];

    @ManyToMany(() => OrderDetails, orderDetail => orderDetail.order_id)
    @JoinTable()
    order_details: OrderDetails[];
}