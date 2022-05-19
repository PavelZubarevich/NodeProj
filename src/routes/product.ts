import { Router } from 'express';
import { ProductRepository } from '../repository';
import { body, query } from 'express-validator';
import { ProductController } from '../controllers';
import { validateQueryDataMiddleware } from '../helpers';

const productRouter = Router();

productRouter.get(
  '/',
  query('displayName').isString().optional(),
  query('minRating')
    .optional()
    .custom((value) => {
      if (!(value === '' || +value >= 0)) {
        throw new Error();
      }
      return true;
    }),
  query('price')
    .custom((value) => {
      const priceString = value || ':';
      const [minPrice, maxPrice] = priceString.split(':');

      if (!((+minPrice >= 0 || minPrice === '') && (+maxPrice >= 0 || maxPrice === ''))) {
        throw new Error();
      }
      return true;
    })
    .optional(),
  query('sortBy')
    .custom((value) => {
      const sortByParam = value || ':';
      const sortDirection = sortByParam.split(':')[1].toLowerCase();

      if (!(sortDirection === 'asc' || sortDirection === 'desc' || sortDirection === '')) {
        throw new Error();
      }
      return true;
    })
    .optional(),
  validateQueryDataMiddleware,
  ProductRepository.all
);

productRouter.post(
  '/:id/rate',
  body('rating').isFloat({ min: 0, max: 10 }),
  body('comment').isString().optional(),
  validateQueryDataMiddleware,
  ProductController.rateProduct
);

productRouter.delete('/:id/rate', ProductController.deleteRating);

export default productRouter;
