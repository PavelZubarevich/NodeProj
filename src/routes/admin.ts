import { Router } from 'express';
import { ProductController } from '../controllers';
import { body } from 'express-validator';
import { validateQueryDataMiddleware } from '../helpers';

const adminRouter = Router();

adminRouter.get('/products/:id', ProductController.getProductById);

adminRouter.post(
  '/products',
  body('displayName').isString(),
  body('price').isFloat({ min: 0 }),
  body('categoryId').isArray().optional(),
  validateQueryDataMiddleware,
  ProductController.addProduct
);

adminRouter.patch('/products/:id', ProductController.deleteRating);

adminRouter.delete('/products/:id', ProductController.deleteProduct);

export default adminRouter;
