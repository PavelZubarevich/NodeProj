import { Response, Request, NextFunction } from 'express';
import { UpdateResult } from 'typeorm';
import { SQLCategory, SQLOrderList, SQLOrderProduct, SQLProduct, SQLSession, SQLUser } from '../entity';
import { UserClass, SessionsClass, ProductClass, CategoryClass, OrderProduct, OrderListClass } from './mongoEntity';
import { ISortProps, ISQLSortProps, IOrderProduct } from './types';

export interface IProductRepository {
  all(req: Request, res: Response, next: NextFunction): void;
  getProductById(id: string): Promise<ProductClass | SQLProduct>;
  updateRatings(
    productId: string,
    userId: string,
    ratings: Array<object>
  ): Promise<ProductClass | SQLProduct | null | string>;
  updateTotalRating(id: string): void;
  deleteRating(productId: string, userId: string): void;
  addProduct(productData: ProductClass | SQLProduct): void;
  deleteProductById(productId: string): void;
  updateProduct(productId: string, data: ProductClass | SQLProduct): void;
}

export interface IProductRatingsRepository {
  getLatestRatings(): void;
  deleteRatings(): void;
}

export interface ICategoryRepository {
  all(req: Request, res: Response, next: NextFunction): void;
  getCategory(req: Request, res: Response, next: NextFunction): void;
  addCategory(categoryData: CategoryClass | SQLCategory): void;
  deleteCategoryById(categoryId: string): void;
  updateCategory(categoryId: string, data: CategoryClass | SQLCategory): void;
}

export interface IUserRepository {
  getUser(params: UserClass): Promise<UserClass | SQLUser | null>;
  getUserById(userId: string): Promise<UserClass | SQLUser | null>;
  addUser(params: UserClass): void;
  updateOne(findParams: SessionsClass, updateParams: SessionsClass): void;
}

export interface ISessionRepository {
  addSession(data: SessionsClass): void;
  getSession(params: SessionsClass): Promise<SessionsClass | SQLSession | null>;
  getCountByField(params: SessionsClass): Promise<number>;
  findOneAndDelete(params: SessionsClass, sorting: ISortProps | ISQLSortProps): void;
  updateOne(findParams: SessionsClass, updateParams: SessionsClass): void;
}

export interface IOrderListRepository {
  getOrderByUserId(userId: string): Promise<OrderListClass | SQLOrderList | null>;
  updateOrderProducts(
    order: SQLOrderList | OrderListClass,
    products?: Array<IOrderProduct>
  ): Promise<OrderListClass | SQLOrderList | null>;
  deleteOrderById(orderId: string): Promise<void>;
  createOrder(userId: string): Promise<OrderListClass | SQLOrderList | undefined>;
}

export interface IOrderProductRepository {
  addProducts(params: IOrderProduct[]): Promise<SQLOrderProduct[] | OrderProduct[]>;
  updateProduct(
    findParams: IOrderProduct,
    updateParams: IOrderProduct
  ): Promise<SQLOrderProduct | OrderProduct | null | UpdateResult>;
  updateProducts(
    order: SQLOrderList | OrderListClass,
    products: Array<IOrderProduct>
  ): Promise<Array<OrderProduct | UpdateResult | null>>;
  updateOrInsertProduct(
    findParams: IOrderProduct,
    updateParams: IOrderProduct
  ): Promise<OrderProduct | SQLOrderProduct>;
  deleteAllProducts(order: SQLOrderList | OrderListClass): Promise<void>;
}
