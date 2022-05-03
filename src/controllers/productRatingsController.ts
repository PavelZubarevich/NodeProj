import { Response, Request, NextFunction } from 'express';
import { IProductRatingsController } from '../types/types';
import { ProductRatingsRepository } from '../repository';

class ProductRatingsController implements IProductRatingsController {
  async getLatestRatings(req: Request, res: Response, next: NextFunction) {
    const ratings = await ProductRatingsRepository.getLatestRatings();

    res.status(200).send(ratings);
  }
}

export default new ProductRatingsController();
