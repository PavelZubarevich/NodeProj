import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { SQLProduct, SQLCategory } from '../entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DB_CONN_STRING,
  synchronize: true,
  logging: false,
  entities: [SQLProduct, SQLCategory],
  migrations: [],
  subscribers: []
});
