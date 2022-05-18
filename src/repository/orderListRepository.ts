import { MongoOrderList } from '../models';
import { IOrderListRepository } from '../types/repository';
import { AppDataSource } from '../db/postgresql';
import { IOrderProduct } from '../types/types';
import { SQLOrderList } from '../entity';
import UserRepository from './userRepository';

const mongo = 'mongo';

class OrderListTypegooseRepository implements IOrderListRepository {
  async getOrderByUserId(userId: string) {
    const order = await MongoOrderList.findOne({ userId });
    return order;
  }

  async updateOrderProducts(order: any, productIds: IOrderProduct[]) {
    productIds.forEach((productId) => {
      if (!order.products?.includes(productId)) {
        order.products?.push(productId);
      }
    });

    order.save();

    return order;
  }

  async deleteOrderById(orderId: string) {
    await MongoOrderList.deleteOne({ _id: orderId });
  }

  async createOrder(userId: string) {
    const order = await MongoOrderList.create({ userId });
    return order;
  }
}

class OrderListTypeOrmRepository implements IOrderListRepository {
  async getOrderByUserId(userId: string) {
    const product = await AppDataSource.manager.findOne(SQLOrderList, {
      relations: {
        userId: true,
        products: true
      },
      where: {
        userId: {
          _id: +userId
        }
      }
    });

    return product;
  }

  async updateOrderProducts(order: SQLOrderList, products: Array<any>) {
    const newOrder = await AppDataSource.manager.findOne(SQLOrderList, {
      relations: { products: true },
      where: { _id: order._id }
    });
    return newOrder;
  }

  async deleteOrderById(orderId: string) {
    await AppDataSource.manager.delete(SQLOrderList, orderId);
  }

  async createOrder(userId: string) {
    const user = await UserRepository.getUserById(userId);
    if (user) {
      const order = await AppDataSource.manager.save(SQLOrderList, { userId: user });
      return order;
    }
  }
}

const OrderListRepository =
  process.env.DB === mongo ? new OrderListTypegooseRepository() : new OrderListTypeOrmRepository();

export default OrderListRepository;
