import { Router } from 'express';
import { CategoryRepository } from '../repository';
import { query } from 'express-validator';

const categoryRouter = Router();

categoryRouter.get('/', CategoryRepository.all);

categoryRouter.get(
  '/:id',
  query('includeProducts')
    .custom((value) => {
      if (!(value === 'true' || value === 'false' || value === '')) {
        throw new Error('includeProducts should be boolean');
      }
      return true;
    })
    .optional(),
  query('includeTop3Products')
    .custom((value) => {
      if (!(value === 'true' || value === 'false' || value === '')) {
        throw new Error('includeTop3Products should be boolean');
      }
      return true;
    })
    .optional(),
  CategoryRepository.getCategory
);

export default categoryRouter;
