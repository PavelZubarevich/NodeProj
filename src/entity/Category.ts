import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { SQLProduct } from './Product';

@Entity()
export class SQLCategory {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  displayName?: string;

  @Column()
  createdAt?: Date;

  @OneToMany(() => SQLProduct, (product) => product.category)
  products?: SQLProduct[];
}
