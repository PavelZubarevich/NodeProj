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
