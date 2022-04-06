import { Router } from 'express';
import { CategoryRepository } from '../repository';

const categoryRouter = Router();

categoryRouter.get('/', CategoryRepository.all);

categoryRouter.get('/:id', CategoryRepository.getCategory);

export default categoryRouter;
