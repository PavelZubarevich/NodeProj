// import { Types } from 'mongoose';
import { prop, index, Ref } from '@typegoose/typegoose';
import { Response, Request, NextFunction } from 'express';
import { FindOptionsOrderValue } from 'typeorm';

export class CategoryClass {
  @prop()
  public displayName?: string;

  @prop()
  public createdAt?: Date;
}

@index({ totalRating: 1 })
@index({ price: 1 })
export class ProductClass {
  @prop()
  public displayName?: string;

  @prop({ ref: () => CategoryClass })
  public categoryId?: Ref<CategoryClass>[];

  @prop()
  public createdAt?: Date;

  @prop()
  public totalRating?: Number;

  @prop()
  public price?: Number;
}

export interface IProductRepository {
  all(req: Request, res: Response, next: NextFunction): void;
}

export interface ICategoryRepository {
  all(req: Request, res: Response, next: NextFunction): void;
  getCategory(req: Request, res: Response, next: NextFunction): void;
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

export interface ISQLSortProps {
  [key: string]: FindOptionsOrderValue;
}
