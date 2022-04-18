import { Router } from 'express';
import { ProductRepository } from '../repository';

const productRouter = Router();

productRouter.get('/', ProductRepository.all);

export default productRouter;
