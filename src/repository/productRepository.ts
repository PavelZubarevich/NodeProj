import { Response, Request, NextFunction } from 'express';
import { MongoProduct } from '../models';
import { SQLProduct } from '../entity';
import { IProductRepository, IFindProps, ITotalRatingFilter, ISortProps } from '../types/types';
import { AppDataSource } from '../db/postgresql';

const mongo = 'mongo';

class ProductTypegooseRepository implements IProductRepository {
  async all(req: Request, res: Response, next: NextFunction) {
    const query = req.query;
    const displayNameReg: RegExp = new RegExp(`${query.displayName}`);
    const prices: Array<string> = query.price?.toString().split(':') || [];
    const findProps: IFindProps = {};

    query.displayName && (findProps.displayName = displayNameReg);
    query.minRating && (findProps.totalRating = { $gt: query.minRating });

    if (prices[0] || prices[1]) {
      const totalRatingFilter: ITotalRatingFilter = {};
      +prices[0] && (totalRatingFilter.$gt = +prices[0]);
      +prices[1] && (totalRatingFilter.$lt = +prices[1]);
      findProps.price = totalRatingFilter;
    }

    const sortProps: ISortProps = {};
    const sortingParams: Array<string> = query.sortBy?.toString().split(':') || [];

    if (sortingParams[0] && sortingParams[1]) {
      sortProps[sortingParams[0]] = sortingParams[1];
    }

    const products = await MongoProduct.find(findProps).sort(sortProps).exec();

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
