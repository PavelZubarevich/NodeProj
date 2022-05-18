import { Response, Request, NextFunction } from 'express';
import { SQLCategory, SQLProduct } from '../entity';
import { UserClass, SessionsClass, ProductClass, CategoryClass } from './mongoEntity';
import { ISortProps, ISQLSortProps, IOrderProduct } from './types';

export interface IProductRepository {
  all(req: Request, res: Response, next: NextFunction): void;
  getProductById(id: string): any;
  updateRatings(productId: string, userId: string, ratings: Array<object>): any;
  updateTotalRating(id: string): void;
  deleteRating(productId: string, userId: string): void;
  addProduct(productData: ProductClass | SQLProduct): void;
  deleteProductById(productId: string): void;
  updateProduct(productId: string, data: ProductClass | SQLProduct): void;
}

export interface IProductRatingsRepository {
  getLatestRatings(): void;
}

export interface ICategoryRepository {
  all(req: Request, res: Response, next: NextFunction): void;
  getCategory(req: Request, res: Response, next: NextFunction): void;
  addCategory(categoryData: CategoryClass | SQLCategory): void;
  deleteCategoryById(categoryId: string): void;
  updateCategory(categoryId: string, data: CategoryClass | SQLCategory): void;
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
