import { MongoProduct } from '../models';
import { SQLUserRating } from '../entity';
import { IUserRating } from '../types/types';
import { IProductRatingsRepository } from '../types/repository';
import { AppDataSource } from '../db/postgresql';

const mongo = 'mongo';

class ProductRatingsTypegooseRepository implements IProductRatingsRepository {
  async getLatestRatings() {
    const products = await MongoProduct.find().sort({ 'ratings.createdAt': -1 }).limit(10);
    let ratings: Array<IUserRating> = [];

    products.forEach((product) => {
      if (product.ratings?.length) {
        ratings.push(...product.ratings);
      }
    });

    ratings = ratings.sort((a, b) => {
      if (a.createdAt < b.createdAt) {
        return 1;
      }
      if (a.createdAt > b.createdAt) {
        return -1;
      }

      return 0;
    });

    return ratings;
  }
}

// ============================

class ProductRatingsTypeOrmRepository implements IProductRatingsRepository {
  async getLatestRatings() {
    const ratings = await AppDataSource.manager.find(SQLUserRating, {
      relations: { productId: true },
      order: { createdAt: -1 },
      take: 10
    });

    return ratings;
  }
}

const ProductRatingsRepository =
  process.env.DB === mongo ? new ProductRatingsTypegooseRepository() : new ProductRatingsTypeOrmRepository();

export default ProductRatingsRepository;
