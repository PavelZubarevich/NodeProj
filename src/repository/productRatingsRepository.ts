import { MongoLastRatings } from '../models';
import { SQLLastRating } from '../entity';
import { IProductRatingsRepository } from '../types/repository';
import { AppDataSource } from '../db/postgresql';

const mongo = 'mongo';

class ProductRatingsTypegooseRepository implements IProductRatingsRepository {
  async getLatestRatings() {
    const ratings = await MongoLastRatings.find().sort({ createdAt: -1 }).limit(10);

    return ratings;
  }

  async deleteRatings() {
    await MongoLastRatings.remove({
      _id: {
        $in: (await MongoLastRatings.find().sort({ createdAt: -1 }).skip(10)).map((a: any) => a._id)
      }
    });
  }
}

// ============================

class ProductRatingsTypeOrmRepository implements IProductRatingsRepository {
  async getLatestRatings() {
    const ratings = await AppDataSource.manager.find(SQLLastRating, {
      relations: { productId: true },
      order: { createdAt: -1 },
      take: 10
    });

    return ratings;
  }

  async deleteRatings() {
    await AppDataSource.manager
      .getRepository(SQLLastRating)
      .createQueryBuilder('last_ratings')
      .delete()
      .where(
        (qb: any) =>
          `_id IN (${qb
            .createQueryBuilder()
            .select('_id')
            .from(SQLLastRating, 'last_ratings')
            .orderBy('last_ratings."createdAt"', 'DESC')
            .skip(10)
            .getQuery()})`
      )
      .execute();
  }
}

const ProductRatingsRepository =
  process.env.DB === mongo ? new ProductRatingsTypegooseRepository() : new ProductRatingsTypeOrmRepository();

export default ProductRatingsRepository;
