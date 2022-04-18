import { Response, Request, NextFunction } from 'express';
import { MongoProduct } from '../models';
import { SQLProduct } from '../entity';
import { IProductRepository, IFindProps, ITotalRatingFilter, ISortProps, ISQLSortProps } from '../types/types';
import { AppDataSource } from '../db/postgresql';
import {
  Like,
  MoreThanOrEqual,
  Between,
  FindManyOptions,
  FindOptionsWhere,
  LessThanOrEqual,
  FindOptionsOrderValue
} from 'typeorm';

const mongo = 'mongo';

class ProductTypegooseRepository implements IProductRepository {
  async all(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query;
      const displayNameReg: RegExp = new RegExp(`${query.displayName}`);
      const prices: Array<string> = query.price?.toString().split(':') || [];
      const findProps: IFindProps = {};
      const skip: number = +(query.offset || 0);
      const limit: number = +(query.limit || Infinity);

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

      const products = await MongoProduct.find(findProps).sort(sortProps).skip(skip).limit(limit).exec();
      res.send(products);
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
      return next(new Error('err'));
    }
  }
}

class ProductTypeOrmRepository implements IProductRepository {
  async all(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query;

      const priceString = query.price?.toString() || ':';
      const [minPrice, maxPrice] = priceString.split(':').map((elem) => Number(elem));

      const sortString = query.sortBy?.toString() || ':';
      const sortingParams = sortString.split(':');
      const sortProps: ISQLSortProps = {};

      if (sortingParams[0] && sortingParams[1]) {
        sortProps[sortingParams[0]] = <FindOptionsOrderValue>sortingParams[1];
      }

      const findProps: FindManyOptions = {};
      const findWhereProps: FindOptionsWhere<SQLProduct> = {};

      query.displayName && (findWhereProps.displayName = Like(`%${query.displayName}%`));
      query.minRating && (findWhereProps.totalRating = MoreThanOrEqual(+query.minRating));

      minPrice === 0 && maxPrice !== 0 && (findWhereProps.price = LessThanOrEqual(maxPrice));
      minPrice !== 0 && maxPrice === 0 && (findWhereProps.price = MoreThanOrEqual(minPrice));
      minPrice !== 0 && maxPrice !== 0 && (findWhereProps.price = Between(minPrice, maxPrice));

      findProps.where = findWhereProps;
      findProps.order = sortProps;
      query.offset && (findProps.skip = +query.offset);
      query.limit && (findProps.take = +query.limit);
      const products = await AppDataSource.manager.find(SQLProduct, findProps);
      res.send(products);
    } catch (e) {
      return next();
    }
  }
}

const ProductRepository = process.env.DB === mongo ? new ProductTypegooseRepository() : new ProductTypeOrmRepository();

export default ProductRepository;
