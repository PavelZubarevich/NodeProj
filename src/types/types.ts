import { Types } from 'mongoose';
import { prop, index } from '@typegoose/typegoose';
import { Response, Request, NextFunction } from 'express';

@index({ totalRating: 1 })
@index({ price: 1 })
export class ProductClass {
  @prop()
  public displayName?: string;

  @prop()
  public categoryId?: Types.ObjectId;

  @prop()
  public createdAt?: Date;

  @prop()
  public totalRating?: Number;

  @prop()
  public price?: Number;
}

export class CategoryClass {
  @prop()
  public displayName?: string;

  @prop()
  public createdAt?: Date;
}

export interface IProductRepository {
  all(req: Request, res: Response, next: NextFunction): void;
}

export interface ICategoryRepository {
  all(req: Request, res: Response, next: NextFunction): void;
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

export interface ISortProps {
  [key: string]: string;
}
