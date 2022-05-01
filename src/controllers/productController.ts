import { Response, Request, NextFunction } from 'express';
import { IProductController } from '../types/types';
import { ProductRepository } from '../repository';
import jwt from 'jsonwebtoken';
import { JWT_ACCESS_SECTER_KEY } from '../config';
import { APIError } from '../error/apiError';
import { validationResult } from 'express-validator';

class ProductController implements IProductController {
  async rateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new APIError(400, `Infalid body params: ${errors.array()[0].param}=${errors.array()[0].value}`);
      }

      const token = req.headers.authorization?.split(' ')[1] || '';
      const user = jwt.verify(token, JWT_ACCESS_SECTER_KEY);

      if ((<any>user).userRole === 'buyer') {
        const ratedProduct = await ProductRepository.getProductById(req.params.id);

        const ratings = [];

        if (ratedProduct) {
          const applyedRatings = ratedProduct.ratings || [];
          ratings.push(...applyedRatings);
          let isRated: boolean = false;
          ratings.map((rating) => {
            if (rating.userId === (<any>user).userId) {
              isRated = true;
              return (rating.rating = +req.body.rating);
            }
            return rating;
          });
          if (!isRated) {
            ratings.push({ userId: (<any>user).userId, rating: +req.body.rating });
          }
        } else {
          throw new APIError(404, 'Product does not exist');
        }

        const newProduct = await ProductRepository.updateRatings(req.params.id, (<any>user).userId, ratings);
        res.status(200).send(newProduct);
      }
    } catch (e) {
      return next(e);
    }
  }

  async deleteRating(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization?.split(' ')[1] || '';
      const user = jwt.verify(token, JWT_ACCESS_SECTER_KEY);

      if ((<any>user).userRole === 'buyer') {
        await ProductRepository.deleteRating(req.params.id, (<any>user).userId);
        res.status(200).send('success');
      }
    } catch (e) {
      return next(e);
    }
  }

  async getProductById(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await ProductRepository.getProductById(req.params.id);
      res.status(200).send(product);
    } catch (e) {
      return next(e);
    }
  }

  async addProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await ProductRepository.addProduct(req.body);
      res.status(200).send(product);
    } catch (e) {
      next(e);
    }
  }
}

export default new ProductController();
