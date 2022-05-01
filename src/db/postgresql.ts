import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { SQLProduct, SQLCategory, SQLSession, SQLUser, SQLUserRating, SQLOrderList, SQLOrderProduct } from '../entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DB_CONN_STRING,
  synchronize: true,
  logging: false,
  entities: [SQLProduct, SQLCategory, SQLSession, SQLUser, SQLUserRating, SQLOrderList, SQLOrderProduct],
  migrations: [],
  subscribers: []
});
