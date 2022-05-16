import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class SQLSession {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  userName?: string;

  @Column()
  refreshToken?: string;
}
