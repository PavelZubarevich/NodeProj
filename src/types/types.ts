import { Types } from 'mongoose';
import { prop } from '@typegoose/typegoose';
import { Response, Request, NextFunction } from 'express';

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
