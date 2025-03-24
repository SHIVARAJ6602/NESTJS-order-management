import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Order } from 'src/orders/entities/order.entity';
import * as bcrypt from 'bcryptjs';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string; 

  @Column({ type: 'varchar', length: 255 })
  pswd: string;

  @OneToMany(() => Order, (order) => order.customer)
  orders: Order[];

  async hashPassword(): Promise<void> {
    const salt = await bcrypt.genSalt(10); 
    this.pswd = await bcrypt.hash(this.pswd, salt);
  }

  async checkPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.pswd);
  }
}

//npm install bcryptjs
