import { Response, Request, NextFunction } from 'express';
import { MongoProduct } from '../models';
import { SQLProduct } from '../entity';
import { IProductRepository } from '../types/types';
import { AppDataSource } from '../db/postgresql';

const mongo = 'mongo';

class ProductTypegooseRepository implements IProductRepository {
  async all(req: Request, res: Response, next: NextFunction) {
    const products = await MongoProduct.find();

    if (products) {
      res.send(products);
    } else {
      res.sendStatus(500);
      return next(new Error('err'));
    }
  }
}

class ProductTypeOrmRepository implements IProductRepository {
  async all(req: Request, res: Response, next: NextFunction) {
    const products = await AppDataSource.manager.find(SQLProduct);

    if (products) {
      res.send(products);
    } else {
      res.sendStatus(500);
      return next(new Error('err'));
    }
  }
}

const ProductRepository = process.env.DB === mongo ? new ProductTypegooseRepository() : new ProductTypeOrmRepository();

export default ProductRepository;
