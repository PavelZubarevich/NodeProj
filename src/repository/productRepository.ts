import { Response, Request } from 'express';
import { MongoProduct } from '../models';
import { SQLProduct } from '../entity';
import { IProductRepository } from '../types/types';
import { AppDataSource } from '../db/postgresql';

const mongo = 'mongo';

class ProductTypegooseRepository implements IProductRepository {
  async all(req: Request, res: Response) {
    const products = await MongoProduct.find();

    if (products) {
      res.send(products);
    } else {
      res.sendStatus(500);
    }
  }
}

class ProductTypeOrmRepository implements IProductRepository {
  async all(req: Request, res: Response) {
    const products = await AppDataSource.manager.find(SQLProduct);

    if (products) {
      res.send(products);
    } else {
      res.sendStatus(500);
    }
  }
}

const ProductRepository = process.env.DB === mongo ? new ProductTypegooseRepository() : new ProductTypeOrmRepository();

export default ProductRepository;
