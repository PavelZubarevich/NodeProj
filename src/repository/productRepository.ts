import { Response, Request, NextFunction } from 'express';
import { MongoProduct } from '../models';
import { SQLProduct, SQLUser, SQLUserRating } from '../entity';
import { IFindProps, ITotalRatingFilter, ISortProps, ISQLSortProps } from '../types/types';
import { IProductRepository } from '../types/repository';
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
import { APIError } from '../error/apiError';
import { validationResult } from 'express-validator';
import mongoose from 'mongoose';

const mongo = 'mongo';

class ProductTypegooseRepository implements IProductRepository {
  async all(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new APIError(400, `Infalid query params: ${errors.array()[0].param}=${errors.array()[0].value}`);
      }

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

      if (products.length > 0) {
        res.send(products);
      } else {
        throw new APIError(404, 'Product does not exist');
      }
    } catch (e) {
      return next(e);
    }
  }

  async getProductById(id: string) {
    try {
      const product = await MongoProduct.findById(id);
      return product;
    } catch (e) {
      throw new APIError(500, 'Internal server error');
    }
  }

  async updateRatings(id: string, userId: string, updateParams: Array<object>) {
    try {
      const product = await MongoProduct.findOneAndUpdate(
        { _id: id },
        {
          $set: { ratings: updateParams }
        },
        { returnDocument: 'after' }
      );
      await this.updateTotalRating(id);
      return product;
    } catch (e) {
      throw new APIError(500, 'Internal server error');
    }
  }

  async updateTotalRating(id: string) {
    try {
      const [rating] = await MongoProduct.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(id) } },
        { $unwind: '$ratings' },
        {
          $group: {
            _id: null,
            totalRating: { $sum: '$ratings.rating' }
          }
        }
      ]);
      let totalRating = 0;

      if (rating) {
        totalRating = rating.totalRating;
      }

      await MongoProduct.findOneAndUpdate(
        { _id: id },
        {
          $set: { totalRating }
        }
      );
    } catch (e) {
      throw new APIError(500, 'Internal server error');
    }
  }

  async deleteRating(productId: string, userId: string) {
    try {
      const product = await this.getProductById(productId);
      const ratings = product?.ratings?.filter((rating: SQLUserRating) => rating.userId !== userId) || [];
      const newProduct = await this.updateRatings(productId, userId, ratings);

      await this.updateTotalRating(productId);
      return newProduct;
    } catch (e) {
      throw new APIError(500, 'Internal server error');
    }
  }
}

// ============================

class ProductTypeOrmRepository implements IProductRepository {
  async all(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new APIError(400, `Infalid query params: ${errors.array()[0].param}=${errors.array()[0].value}`);
      }

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
      if (products.length > 0) {
        res.send(products);
      } else {
        throw new APIError(404, 'Product does not exist');
      }
      res.send(products);
    } catch (e) {
      return next(e);
    }
  }

  async getProductById(id: string) {
    try {
      const product = await AppDataSource.manager.findOneBy(SQLProduct, { _id: +id });
      return product;
    } catch (e) {
      throw new APIError(500, 'Internal server error');
    }
  }

  async updateRatings(id: string, userId: string, updateParams: Array<SQLUserRating>) {
    const ratedProduct = await AppDataSource.manager.findOne(SQLProduct, {
      relations: { ratings: true },
      where: {
        _id: +id,
        ratings: {
          userId: {
            _id: +userId
          }
        }
      }
    });

    const userRatings = ratedProduct?.ratings || [];
    const userRatingId = userRatings[0]?._id;

    if (userRatingId) {
      await AppDataSource.manager.update(
        SQLUserRating,
        {
          _id: userRatingId
        },
        {
          rating: updateParams[0].rating
        }
      );
      await this.updateTotalRating(id);
      return 'updated';
    } else {
      const user = await AppDataSource.manager.findOneOrFail(SQLUser, { where: { _id: +userId } });
      const product = await AppDataSource.manager.findOneOrFail(SQLProduct, { where: { _id: +id } });

      const rating = await AppDataSource.getRepository(SQLUserRating).save({
        userId: user,
        productId: product,
        rating: updateParams[0].rating
      });
      await this.updateTotalRating(id);
      return rating;
    }
  }

  async updateTotalRating(id: string) {
    try {
      const productRating =
        (await AppDataSource.manager.findOne(SQLProduct, {
          relations: {
            ratings: true
          },
          where: { _id: +id },
          select: {
            _id: true,
            ratings: true
          }
        })) || {};

      const totalRating = productRating.ratings?.reduce((acc, elem) => {
        return (acc += elem.rating || 0);
      }, 0);

      await AppDataSource.manager.update(SQLProduct, { _id: +id }, { totalRating });
    } catch (e) {
      throw new APIError(500, 'Internal server error');
    }
  }

  async deleteRating(productId: string, userId: string) {
    try {
      await AppDataSource.manager.delete(SQLUserRating, {
        userId: {
          _id: +userId
        },
        productId: {
          _id: +productId
        }
      });
      await this.updateTotalRating(productId);
    } catch (e) {}
  }
}

const ProductRepository = process.env.DB === mongo ? new ProductTypegooseRepository() : new ProductTypeOrmRepository();

export default ProductRepository;
