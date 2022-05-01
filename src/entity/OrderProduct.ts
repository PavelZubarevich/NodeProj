import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { SQLOrderList } from './OrderList';
import { SQLProduct } from './Product';

@Entity()
export class SQLOrderProduct {
  @PrimaryGeneratedColumn()
  _id?: number;

  @ManyToOne(() => SQLProduct)
  productId!: SQLProduct;

  @ManyToOne(() => SQLOrderList, (orderList) => orderList.products)
  orderListId?: SQLOrderList;

  @Column()
  quantity!: Number;
}
