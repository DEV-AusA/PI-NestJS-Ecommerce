import { Orders } from "src/orders/entities/orders.entity";
import { Column, Entity, JoinColumn, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name: "users"   //* <= este  sera el nombre en la tabla de nuestra DB, se usa en plural para evitar conoflicto de nombres
})
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type:'varchar', length: 50, nullable: false }) // maximo 50 chars y no puede ser nulo
    name: string;

    @Column({ type:'varchar', length: 50, nullable: false, unique: true }) // unico 
    email: string;

    @Column({ type:'varchar', length: 20, nullable: false })
    password: string;

    @Column({type: 'integer'})
    phone: number;

    @Column({ type:'varchar', length: 50 })
    country?: string;

    @Column({ type: 'varchar' })
    address: string;

    @Column({ type: 'varchar', length: 50 })
    city?: string;

    @Column({ type: 'timestamp' }) // Esto podria ser 'date'(fecha)
    created_at: Date;

    @OneToMany( () => Orders, ((order) =>order.order_details))
    @JoinColumn()
    orders_id: Orders[]
}