import { Orders } from '../../orders/entities/orders.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'users', //* <= este  sera el nombre en la tabla de nuestra DB, se usa en plural para evitar conoflicto de nombres
})
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, nullable: false }) // maximo 50 chars y no puede ser nulo
  name: string;

  @Column({ type: 'varchar', length: 50, nullable: false, unique: true }) // unico
  email: string;

  @Column({ type: 'text', nullable: false })
  password: string;

  @Column({ type: 'integer' })
  phone: number;

  @Column({ type: 'varchar', length: 50 })
  country?: string;

  @Column({ type: 'varchar' })
  address: string;

  @Column({ type: 'varchar', length: 50 })
  city?: string;

  @Column({ type: 'bool', default: true, nullable: false, select: false })
  active: boolean;

  @Column()
  last_login: Date;

  @Column({ type: 'timestamp', select: false }) // Esto podria ser 'date'(fecha)
  created_at: Date;

  @OneToMany(() => Orders, (order) => order.user_id, { eager: true })
  @JoinColumn()
  orders_id: Orders[];

  @Column({ name: 'is_admin', default: false })
  isAdmin: boolean;
}
