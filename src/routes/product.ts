import { Router } from 'express';
import { ProductRepository } from '../repository';
import { query } from 'express-validator';

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
  ProductRepository.all
);

export default productRouter;
