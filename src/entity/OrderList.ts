import { Entity, PrimaryGeneratedColumn, ManyToMany, OneToOne, JoinTable } from 'typeorm';
import { SQLProduct, SQLUser } from '.';

@Entity()
export class SQLOrderList {
  @PrimaryGeneratedColumn()
  _id?: number;

  @OneToOne(() => SQLUser, { nullable: false })
  @JoinTable()
  user?: SQLUser;

  @ManyToMany(() => SQLProduct)
  @JoinTable()
  products?: {
    product: SQLProduct[];
    quantity: number;
  };
}
