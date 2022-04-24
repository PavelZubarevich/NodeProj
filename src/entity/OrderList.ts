import { Entity, PrimaryGeneratedColumn, ManyToMany, OneToOne, JoinTable } from 'typeorm';
import { SQLProduct, SQLUser } from '.';

@Entity()
export class SQLOrderList {
  @PrimaryGeneratedColumn()
  _id?: number;

  @OneToOne(() => SQLUser)
  @JoinTable()
  user?: SQLUser;

  @ManyToMany(() => SQLProduct)
  @JoinTable()
  products?: SQLProduct[];
}
