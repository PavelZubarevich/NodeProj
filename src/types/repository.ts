import { Response, Request, NextFunction } from 'express';
import { UserClass, SessionsClass } from './mongoEntity';
import { ISortProps, ISQLSortProps } from './types';

export interface IProductRepository {
  all(req: Request, res: Response, next: NextFunction): void;
  getProductById(id: string): any;
  updateRatings(productId: string, userId: string, ratings: Array<object>): any;
  updateTotalRating(id: string): void;
  deleteRating(productId: string, userId: string): void;
}

export interface ICategoryRepository {
  all(req: Request, res: Response, next: NextFunction): void;
  getCategory(req: Request, res: Response, next: NextFunction): void;
}

export interface IUserRepository {
  getUser(params: UserClass): any;
  addUser(params: UserClass): void;
  updateOne(findParams: SessionsClass, updateParams: SessionsClass): void;
}

export interface ISessionRepository {
  addSession(data: SessionsClass): void;
  getSession(params: SessionsClass): any;
  getCountByField(params: SessionsClass): any;
  findOneAndDelete(params: SessionsClass, sorting: ISortProps | ISQLSortProps): void;
  updateOne(findParams: SessionsClass, updateParams: SessionsClass): void;
}
