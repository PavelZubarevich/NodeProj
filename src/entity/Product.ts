import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  ManyToMany,
  JoinTable,
  OneToMany,
  CreateDateColumn
} from 'typeorm';
import { SQLUserRating, SQLCategory } from './';

@Entity()
export class SQLProduct {
  @PrimaryGeneratedColumn()
  _id?: number;

  @Column({ unique: true })
  displayName?: string;

  @CreateDateColumn()
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

  @OneToMany(() => SQLUserRating, (rating) => rating.productId)
  ratings?: SQLUserRating[];
}
