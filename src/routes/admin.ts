import { Router } from 'express';
import { ProductRepository } from '../repository';
// import { body, query } from 'express-validator';
import { ProductController } from '../controllers';

const adminRouter = Router();

adminRouter.get('/products/:id', ProductRepository.all);

adminRouter.post('/products', ProductController.rateProduct);

adminRouter.patch('/products/:id', ProductController.deleteRating);

adminRouter.delete('/products/:id', ProductController.deleteRating);

export default adminRouter;
