import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Products } from '../entity/Products';
import { Category } from '../entity/Category';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'root',
  database: 'node_lab',
  synchronize: true,
  logging: false,
  entities: [Products, Category],
  migrations: [],
  subscribers: [],
});
