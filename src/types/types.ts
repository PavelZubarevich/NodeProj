import { Response, Request, NextFunction } from 'express';
import { FindOptionsOrderValue } from 'typeorm';
import { ProductClass } from './mongoEntity';

export interface ISortProps {
  [key: string]: string;
}

export interface ISQLSortProps {
  [key: string]: FindOptionsOrderValue;
}

export interface ExtendedProductClass extends ProductClass {
  _id?: string;
  'ratings.userId'?: string;
}

export interface IProductController {
  rateProduct(req: Request, res: Response, next: NextFunction): void;
  deleteRating(req: Request, res: Response, next: NextFunction): void;
  getProductById(req: Request, res: Response, next: NextFunction): void;
  addProduct(req: Request, res: Response, next: NextFunction): void;
  deleteProduct(req: Request, res: Response, next: NextFunction): void;
  updateProduct(req: Request, res: Response, next: NextFunction): void;
}

export interface IProductRatingsController {
  getLatestRatings(req: Request, res: Response, next: NextFunction): void;
  deleteRatings(): void;
}

export interface ICategoryController {
  addCategory(req: Request, res: Response, next: NextFunction): void;
  deleteCategory(req: Request, res: Response, next: NextFunction): void;
  updateCategory(req: Request, res: Response, next: NextFunction): void;
}

export interface ITotalRatingFilter {
  $gt?: number;
  $lt?: number;
}
export interface IFindProps {
  displayName?: RegExp;
  totalRating?: Object;
  price?: ITotalRatingFilter;
}

export interface IOrderListController {
  addProductToOrder(req: Request, res: Response, next: NextFunction): void;
  updateOrder(req: Request, res: Response, next: NextFunction): void;
  deleteOrderList(req: Request, res: Response, next: NextFunction): void;
}

export interface IOrderProduct {
  productId?: string;
  orderListId?: string;
  quantity?: number;
}

export interface IUserRating {
  userId: any;
  rating: number;
  createdAt: Date;
}
