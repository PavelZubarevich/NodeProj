import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, UpdateDateColumn } from 'typeorm';
import { SQLProduct } from '.';
import { SQLUser } from './User';

@Entity()
export class SQLLastRating {
  @PrimaryGeneratedColumn()
  _id?: number;

  @ManyToOne(() => SQLUser, (user) => user.ratings)
  userId?: SQLUser;

  @ManyToOne(() => SQLProduct, (product) => product.ratings)
  productId?: SQLProduct;

  @Column()
  rating?: number;

  @UpdateDateColumn()
  createdAt?: Date;
}
