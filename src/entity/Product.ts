import { Entity, PrimaryGeneratedColumn, Column, Index, ManyToMany, JoinTable } from 'typeorm';
import { SQLCategory } from './Category';

@Entity()
export class SQLProduct {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  displayName?: string;

  @Column()
  createdAt?: Date;

  @Index()
  @Column()
  totalRating?: number;

  @Index()
  @Column()
  price?: number;

  @ManyToMany(() => SQLCategory, (category) => category.products)
  @JoinTable()
  categoryId?: SQLCategory[];
}
