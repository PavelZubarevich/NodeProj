import { Response, Request, NextFunction } from 'express';
import { IProductController } from '../types/types';
import { ProductRepository } from '../repository';
import jwt from 'jsonwebtoken';
import { JWT_ACCESS_SECTER_KEY } from '../config';
import { APIError } from '../error/apiError';
import { WebSocket } from 'ws';

class ProductController implements IProductController {
  async rateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const ws = new WebSocket('ws://localhost:8080');

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
              rating.rating = +req.body.rating;
              rating.createdAt = new Date();
              return rating;
            }
            return rating;
          });
          if (!isRated) {
            ratings.push({
              userId: (<any>user).userId,
              rating: +req.body.rating,
              createdAt: new Date()
            });
          }
        } else {
          throw new APIError(404, 'Product does not exist');
        }

        const newProduct = await ProductRepository.updateRatings(req.params.id, (<any>user).userId, ratings);

        ws.send('');
        res.status(200).send(newProduct);
      } else {
        throw new APIError(401, 'Buyers only');
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
      res.status(200).send({ product, authenticate: res.locals.token });
    } catch (e) {
      return next(e);
    }
  }

  async addProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await ProductRepository.addProduct(req.body);
      res.status(200).send({ product, authenticate: res.locals.token });
    } catch (e) {
      next(e);
    }
  }

  async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await ProductRepository.deleteProductById(req.params.id);

      if (!product) {
        throw new APIError(404, 'Product does not exist');
      }
      res.status(200).send({ product, authenticate: res.locals.token });
    } catch (e) {
      next(e);
    }
  }

  async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await ProductRepository.updateProduct(req.params.id, req.body);
      res.status(200).send({ product, authenticate: req.headers.authorization });
    } catch (e) {
      next(e);
    }
  }
}

export default new ProductController();
