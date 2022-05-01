import { Response, Request, NextFunction } from 'express';
import { ICategoryController } from '../types/types';
import { CategoryRepository } from '../repository';
import { APIError } from '../error/apiError';

class CategoryController implements ICategoryController {
  async addCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await CategoryRepository.addCategory(req.body);
      res.status(200).send(category);
    } catch (e) {
      next(e);
    }
  }

  async deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await CategoryRepository.deleteCategoryById(req.params.id);

      if (!category) {
        throw new APIError(404, 'Category does not exist');
      }
      res.status(200).send(category);
    } catch (e) {
      next(e);
    }
  }

  async updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await CategoryRepository.updateCategory(req.params.id, req.body);
      res.status(200).send(category);
    } catch (e) {
      next(e);
    }
  }
}

export default new CategoryController();
