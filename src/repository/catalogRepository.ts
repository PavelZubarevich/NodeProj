import { Response, Request, NextFunction } from 'express';
import { MongoCategory } from '../models';
import { SQLCategory, SQLProduct } from '../entity';
import { ICategoryRepository } from '../types/types';
import { AppDataSource } from '../db/postgresql';
import { Types } from 'mongoose';
import { FindManyOptions } from 'typeorm';

const mongo = 'mongo';

class CategoryTypegooseRepository implements ICategoryRepository {
  async all(req: Request, res: Response, next: NextFunction) {
    try {
      const products = await MongoCategory.find({}, 'displayName');
      res.send(products);
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
      return next(new Error('err'));
    }
  }

  async getCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const includeProducts = req.query.includeProducts === 'true';
      const includeTop3Products = req.query.includeTop3Products === 'top';
      let category = null;

      if (includeProducts) {
        category = await MongoCategory.aggregate([
          {
            $match: { _id: new Types.ObjectId(req.params.id) }
          },
          { $project: { createdAt: 0 } },
          {
            $lookup: {
              from: 'productclasses',
              localField: '_id',
              foreignField: 'categoryId',
              as: 'products',
              pipeline: includeTop3Products
                ? [
                    { $project: { displayName: 1, price: 1, totalRating: 1, _id: 0 } },
                    { $sort: { totalRating: -1 } },
                    { $limit: 3 }
                  ]
                : [{ $project: { displayName: 1, price: 1, totalRating: 1, _id: 0 } }]
            }
          }
        ]);
      } else {
        category = await MongoCategory.find({ _id: req.params.id }, 'displayName');
      }
      res.send(category);
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
      return next(new Error('err'));
    }
  }
}

class CategoryTypeOrmRepository implements ICategoryRepository {
  async all(req: Request, res: Response) {
    try {
      const category = await AppDataSource.manager.find(SQLCategory);
      res.send(category);
    } catch (e) {
      res.sendStatus(500);
    }
  }

  async getCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const includeProducts = req.query.includeProducts === 'true';
      const includeTop3Products = req.query.includeTop3Products === 'top';
      const categoryId = +req.params.id;
      let category = null;
      if (includeProducts) {
        category = await AppDataSource.manager.findOne(SQLCategory, {
          where: {
            id: categoryId
          },
          select: ['id', 'displayName']
        });
        if (category) {
          const findOptions: FindManyOptions = {
            where: {
              categoryId: category
            },
            select: ['id', 'displayName', 'price', 'totalRating']
          };

          if (includeTop3Products) {
            findOptions.order = {
              totalRating: 'desc'
            };
            findOptions.take = 3;
          }

          category.products = await AppDataSource.manager.find(SQLProduct, findOptions);
        }
      } else {
        category = await AppDataSource.manager.findOne(SQLCategory, {
          where: {
            id: +req.params.id
          }
        });
      }

      if (category) {
        res.send(category);
      }
    } catch (e) {
      return next(e);
    }
  }
}

const CategoryRepository =
  process.env.DB === mongo ? new CategoryTypegooseRepository() : new CategoryTypeOrmRepository();

export default CategoryRepository;
