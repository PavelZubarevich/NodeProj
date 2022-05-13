import 'reflect-metadata';
import { DataSource } from 'typeorm';
import {
  SQLProduct,
  SQLCategory,
  SQLSession,
  SQLUser,
  SQLUserRating,
  SQLOrderList,
  SQLOrderProduct,
  SQLLastRating
} from '../entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  ssl: process.env.DB_SSL ? { rejectUnauthorized: false } : false,
  url: process.env.DATABASE_URL,
  synchronize: true,
  logging: false,
  entities: [SQLProduct, SQLCategory, SQLSession, SQLUser, SQLUserRating, SQLOrderList, SQLOrderProduct, SQLLastRating],
  migrations: [],
  subscribers: []
});
