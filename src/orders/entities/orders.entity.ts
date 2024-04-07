import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { OrderDetails } from "./order-details.entity";

@Entity({
    name: "orders"   //* <= este  sera el nombre en la tabla de nuestra DB, se usa en plural para evitar conoflicto de nombres
})
export class Orders {

    // @PrimaryColumn({ type:'uuid', unique: true, nullable: false})
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type:'varchar', length: 50, nullable: false })
    date: string;
    
    @OneToMany( () => User, ((user) =>user.id))
    user_id: User[]

    @OneToOne(() => OrderDetails)
    @JoinColumn()  
    order_details: OrderDetails;

}
