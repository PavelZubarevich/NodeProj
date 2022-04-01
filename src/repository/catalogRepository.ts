import { Response, Request } from 'express';
import { MongoCategory } from '../models';
import { SQLCategory } from '../entity';
import { IProductRepository } from '../types/types';
import { AppDataSource } from '../db/postgresql';

const mongo = 'mongo';

class CategoryTypegooseRepository implements IProductRepository {
  async all(req: Request, res: Response) {
    const products = await MongoCategory.find({}, 'displayName');

    if (products) {
      res.send(products);
    } else {
      res.sendStatus(500);
    }
  }
}

class CategoryTypeOrmRepository implements IProductRepository {
  async all(req: Request, res: Response) {
    const products = await AppDataSource.manager.find(SQLCategory);

    if (products) {
      res.send(products);
    } else {
      res.sendStatus(500);
    }
  }
}

const CategoryRepository =
  process.env.DB === mongo ? new CategoryTypegooseRepository() : new CategoryTypeOrmRepository();

export default CategoryRepository;
