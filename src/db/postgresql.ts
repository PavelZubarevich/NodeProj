import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { SQLProduct, SQLCategory } from '../entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'root',
  database: 'node_lab',
  synchronize: true,
  logging: false,
  entities: [SQLProduct, SQLCategory],
  migrations: [],
  subscribers: []
});
