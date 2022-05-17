import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, CreateDateColumn } from 'typeorm';
import { SQLProduct } from './Product';

@Entity()
export class SQLCategory {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  displayName?: string;

  @CreateDateColumn()
  createdAt?: Date;

  @ManyToMany(() => SQLProduct, (product) => product.categoryId)
  products?: SQLProduct[];
}
