import { Router } from 'express';
import { ProductController } from '../controllers';

const adminRouter = Router();

adminRouter.get('/products/:id', ProductController.getProductById);

adminRouter.post('/products', ProductController.rateProduct);

adminRouter.patch('/products/:id', ProductController.deleteRating);

adminRouter.delete('/products/:id', ProductController.deleteRating);

export default adminRouter;
