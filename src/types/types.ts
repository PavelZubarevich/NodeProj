// import { Types } from 'mongoose';
import { prop, index, Ref } from '@typegoose/typegoose';
import { Response, Request, NextFunction } from 'express';
import { FindOptionsOrderValue } from 'typeorm';

export interface ISortProps {
  [key: string]: string;
}

export interface ISQLSortProps {
  [key: string]: FindOptionsOrderValue;
}

export class SessionsClass {
  @prop({ require: true })
  public userName?: string;

  @prop({ required: true })
  public refreshToken?: string;
}

export class UserClass {
  @prop({ unique: true, require: true })
  public userName?: string;

  @prop({ required: true })
  public password?: string;

  @prop()
  public firstName?: string;

  @prop()
  public lastName?: string;
}

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

export interface ITotalRatingFilter {
  $gt?: number;
  $lt?: number;
}
export interface IFindProps {
  displayName?: RegExp;
  totalRating?: Object;
  price?: ITotalRatingFilter;
}
