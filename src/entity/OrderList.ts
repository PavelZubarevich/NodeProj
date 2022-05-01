import { Entity, PrimaryGeneratedColumn, OneToOne, OneToMany, JoinColumn } from 'typeorm';
import { SQLUser } from '.';
import { SQLOrderProduct } from './OrderProduct';

@Entity()
export class SQLOrderList {
  @PrimaryGeneratedColumn()
  _id?: number;

  @OneToOne(() => SQLUser, { nullable: false })
  @JoinColumn()
  userId?: SQLUser;

  @OneToMany(() => SQLOrderProduct, (product) => product.orderListId, { nullable: true })
  @JoinColumn()
  products?: SQLOrderProduct[];
}
