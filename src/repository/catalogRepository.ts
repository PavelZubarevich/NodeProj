import { Response, Request } from 'express';
import { MongoCategory } from '../models';
import { SQLCategory } from '../entity';
import { ICategoryRepository } from '../types/types';
import { AppDataSource } from '../db/postgresql';
import { Types } from 'mongoose';

const mongo = 'mongo';

class CategoryTypegooseRepository implements ICategoryRepository {
  async all(req: Request, res: Response) {
    const products = await MongoCategory.find({}, 'displayName');

    if (products) {
      res.send(products);
    } else {
      res.sendStatus(500);
    }
  }

  async getCategory(req: Request, res: Response) {
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

    if (category) {
      res.send(category);
    } else {
      res.sendStatus(500);
    }
  }
}

class CategoryTypeOrmRepository implements ICategoryRepository {
  async all(req: Request, res: Response) {
    const products = await AppDataSource.manager.find(SQLCategory);

    if (products) {
      res.send(products);
    } else {
      res.sendStatus(500);
    }
  }

  async getCategory(req: Request, res: Response) {}
}

const CategoryRepository =
  process.env.DB === mongo ? new CategoryTypegooseRepository() : new CategoryTypeOrmRepository();

export default CategoryRepository;
