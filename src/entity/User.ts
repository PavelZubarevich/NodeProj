import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class SQLUser {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  userName?: string;

  @Column()
  password?: string;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;
}
