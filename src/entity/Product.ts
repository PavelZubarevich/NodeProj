import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { SQLCategory } from './Category';

@Entity()
export class SQLProduct {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  displayName?: string;

  @Column()
  createdAt?: Date;

  @Column()
  totalRating?: number;

  @Column()
  price?: number;

  @ManyToOne(() => SQLCategory, (category) => category.products) // note: we will create author property in the Photo class below
  category?: SQLCategory;
}
