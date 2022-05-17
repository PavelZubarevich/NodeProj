import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { SQLUserRating } from './';

@Entity()
export class SQLUser {
  @PrimaryGeneratedColumn()
  _id?: number;

  @Column()
  userName?: string;

  @Column()
  password?: string;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ default: 'buyer' })
  role?: string;

  @OneToMany(() => SQLUserRating, (rating) => rating.userId)
  ratings?: SQLUserRating[];
}
