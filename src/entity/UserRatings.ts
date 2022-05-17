import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { SQLProduct } from './';
import { SQLUser } from './User';

@Entity()
export class SQLUserRating {
  @PrimaryGeneratedColumn()
  _id?: number;

  @ManyToOne(() => SQLUser, (user) => user.ratings)
  userId?: SQLUser;

  @ManyToOne(() => SQLProduct, (product) => product.ratings)
  productId?: SQLProduct;

  @Column()
  rating?: number;
}
