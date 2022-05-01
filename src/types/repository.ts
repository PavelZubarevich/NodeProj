import { Response, Request, NextFunction } from 'express';
import { UserClass, SessionsClass } from './mongoEntity';
import { ISortProps, ISQLSortProps, IOrderProduct } from './types';

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
  getUserById(userId: string): any;
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

export interface IOrderListRepository {
  getOrderByUserId(userId: string): any;
  updateOrderProducts(order: any, products?: Array<IOrderProduct>): Promise<any>;
  deleteOrderById(orderId: string): Promise<any>;
  createOrder(userId: string): Promise<any>;
}

export interface IOrderProductRepository {
  addProducts(params: IOrderProduct[]): Promise<any>;
  updateProduct(findParams: IOrderProduct, updateParams: IOrderProduct): Promise<any>;
  updateProducts(order: any, products: Array<IOrderProduct>): Promise<any>;
  updateOrInsertProduct(findParams: IOrderProduct, updateParams: IOrderProduct): Promise<any>;
  deleteAllProducts(order: any): Promise<any>;
}
