import { Response, Request, NextFunction } from 'express';
import { MongoCategory } from '../models';
import { SQLCategory, SQLProduct } from '../entity';
import { ICategoryRepository } from '../types/repository';
import { AppDataSource } from '../db/postgresql';
import { Types } from 'mongoose';
import { FindManyOptions } from 'typeorm';
import { APIError } from '../error/apiError';
import { CategoryClass } from '../types/mongoEntity';

const mongo = 'mongo';

class CategoryTypegooseRepository implements ICategoryRepository {
  async all(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await MongoCategory.find({}, 'displayName');
      if (category.length > 0) {
        res.send(category);
      } else {
        throw new APIError(404, 'Category does not exist');
      }
    } catch (e) {
      res.sendStatus(500);
      return next(new Error('err'));
    }
  }

  async getCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const includeProducts = req.query.includeProducts === 'true';
      const includeTop3Products = req.query.includeTop3Products === 'true';
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
      if (category.length > 0) {
        res.send(category);
      } else {
        throw new APIError(404, 'Category does not exist');
      }
    } catch (e) {
      return next(e);
    }
  }

  async addCategory(categoryData: CategoryClass) {
    const category = await MongoCategory.create({
      displayName: categoryData.displayName,
      createdAt: Date.now()
    });
    return category;
  }

  async deleteCategoryById(categoryId: string) {
    const category = await MongoCategory.findOneAndDelete({ _id: categoryId });
    return category;
  }

  async updateCategory(categoryId: string, data: CategoryClass) {
    const product = await MongoCategory.findOneAndUpdate({ _id: categoryId }, data, {
      returnDocument: 'after'
    });
    return product;
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
      const includeTop3Products = req.query.includeTop3Products === 'true';
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

      if (category instanceof Object) {
        res.send(category);
      } else {
        throw new APIError(404, 'Category does not exist');
      }
    } catch (e) {
      return next(e);
    }
  }

  async addCategory(categoryData: SQLCategory) {
    const category = await AppDataSource.manager.save(SQLCategory, {
      displayName: categoryData.displayName
    });

    return category;
  }

  async deleteCategoryById(categoryId: string) {
    await AppDataSource.manager.remove(SQLCategory, { id: +categoryId });
    return `Category ${categoryId} deleted`;
  }

  async updateCategory(categoryId: string, data: SQLCategory) {
    const category = await AppDataSource.manager.findOneBy(SQLCategory, { id: +categoryId });

    const newCategory = await AppDataSource.manager.save(SQLCategory, {
      id: category?.id,
      displayName: data.displayName
    });
    return newCategory;
  }
}

const CategoryRepository =
  process.env.DB === mongo ? new CategoryTypegooseRepository() : new CategoryTypeOrmRepository();

export default CategoryRepository;
