import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { Customer } from 'src/customers/entities/customer.entity';
import { OrderProduct } from 'src/orderproducts/entities/orderproduct.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Customer, (customer) => customer.orders)
  customer: Customer;

  @Column({ type: 'text' })
  shippingAddress: string;

  @Column({ type: 'varchar', default: 'pending' })
  status: string;

  @Column({ type: 'decimal', default: 0 })
  totalPrice: number;

  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.order)
  products: OrderProduct[];  // This is the missing property

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}

export enum OrderStatus {
  PENDING = 'pending',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELED = 'canceled',
}
