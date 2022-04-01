import { Router } from 'express';
import { CategoryRepository } from '../repository';

const categoryRouter = Router();

categoryRouter.get('/', CategoryRepository.all);

export default categoryRouter;
