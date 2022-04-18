import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { SQLProduct } from './Product';

@Entity()
export class SQLCategory {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  displayName?: string;

  @Column()
  createdAt?: Date;

  @ManyToMany(() => SQLProduct, (product) => product.categoryId)
  products?: SQLProduct[];
}
