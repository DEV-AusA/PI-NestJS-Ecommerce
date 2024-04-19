import { User } from "../../users/entities/user.entity";
import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { OrderDetails } from "./order-details.entity";

@Entity({
    name: "orders"   //* <= este  sera el nombre en la tabla de nuestra DB, se usa en plural para evitar conoflicto de nombres
})
export class Orders {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type:'timestamp' }) // Esto podria ser 'date'(fecha)
    date: Date;
    
    @OneToOne(
        () => OrderDetails, orderDetails => orderDetails.order_id,
        {cascade: true, eager: true}
    )
    order_details: OrderDetails;
    
    @ManyToOne( () => User, ((user) =>user.orders_id))
    user_id: User
}
