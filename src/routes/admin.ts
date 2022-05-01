import { Router } from 'express';
import { ProductController, CategoryController } from '../controllers';
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

adminRouter.patch(
  '/products/:id',
  body('displayName').isString(),
  body('price').isFloat({ min: 0 }),
  body('categoryId').isArray().optional(),
  validateQueryDataMiddleware,
  ProductController.updateProduct
);

adminRouter.delete('/products/:id', ProductController.deleteProduct);

adminRouter.post(
  '/categories',
  body('displayName').isString(),
  validateQueryDataMiddleware,
  CategoryController.addCategory
);

adminRouter.patch(
  '/categories/:id',
  body('displayName').isString(),
  validateQueryDataMiddleware,
  CategoryController.updateCategory
);

adminRouter.delete('/categories/:id', CategoryController.deleteCategory);

export default adminRouter;
