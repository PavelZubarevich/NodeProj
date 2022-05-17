import { AppDataSource } from '../db/postgresql';
import { SQLOrderList, SQLProduct } from '../entity';
import { SQLOrderProduct } from '../entity/OrderProduct';
import { MongoOrderProduct } from '../models';
import { IOrderProductRepository } from '../types/repository';
import { IOrderProduct } from '../types/types';

const mongo = 'mongo';

class OrderProductTypegooseRepository implements IOrderProductRepository {
  async addProducts(params: IOrderProduct[]) {
    const products = await MongoOrderProduct.insertMany(params);
    return products;
  }

  async updateProduct(findParams: IOrderProduct, updateParams: IOrderProduct) {
    const product = await MongoOrderProduct.findOneAndUpdate(findParams, updateParams, {
      returnDocument: 'after'
    });
    return product;
  }

  async updateOrInsertProduct(findParams: IOrderProduct, updateParams: IOrderProduct) {
    const product = await MongoOrderProduct.findOneAndUpdate(findParams, updateParams, {
      upsert: true,
      returnDocument: 'after'
    });
    return product;
  }

  async updateProducts(order: any, products: Array<IOrderProduct>) {
    const response = [];
    for (const product of products) {
      const dbProduct = await this.updateProduct(
        { productId: product.productId, orderListId: order._id },
        { quantity: product.quantity }
      );
      response.push(dbProduct);
    }
    return response;
  }

  async deleteAllProducts(order: any) {
    await MongoOrderProduct.deleteMany({ orderListId: order._id });
  }
}

class OrderProductTypeOrmRepository implements IOrderProductRepository {
  async addProducts(params: IOrderProduct[]) {
    const productsPayload = [];

    for (const product of params) {
      productsPayload.push({
        productId: await AppDataSource.manager.findOneByOrFail(SQLProduct, { _id: +(product.productId || 0) }),
        orderListId: await AppDataSource.manager.findOneByOrFail(SQLOrderList, { _id: +(product.orderListId || 0) }),
        quantity: product.quantity
      });
    }

    const products = await AppDataSource.manager.save(SQLOrderProduct, [...productsPayload]);
    return products;
  }

  async updateProduct(findParams: IOrderProduct, updateParams: any) {
    const product = await AppDataSource.manager.update(SQLOrderProduct, findParams, updateParams);
    return product;
  }

  async updateOrInsertProduct(findParams: any, updateParams: any) {
    const product = await AppDataSource.manager.findOne(SQLOrderProduct, {
      relations: {
        productId: true,
        orderListId: true
      },
      where: {
        orderListId: {
          _id: +findParams.orderListId
        },
        productId: {
          _id: +findParams.productId
        }
      }
    });

    let newProduct;

    if (product) {
      newProduct = await AppDataSource.manager.save(SQLOrderProduct, {
        _id: product._id,
        orderListId: product.orderListId,
        productId: product.productId,
        quantity: updateParams.quantity
      });
    } else {
      newProduct = await AppDataSource.manager.save(SQLOrderProduct, {
        orderListId: await AppDataSource.manager.findOneByOrFail(SQLOrderList, { _id: findParams.orderListId }),
        productId: findParams.productId,
        quantity: updateParams.quantity
      });
    }
    return newProduct;
  }

  async updateProducts(order: any, products: Array<IOrderProduct>) {
    const response = [];
    for (const product of products) {
      const dbProduct = await this.updateProduct(
        { productId: product.productId, orderListId: order._id },
        { quantity: product.quantity }
      );
      response.push(dbProduct);
    }
    return response;
  }

  async deleteAllProducts(order: any): Promise<any> {
    await AppDataSource.manager.delete(SQLOrderProduct, { orderListId: { _id: order._id } });
  }
}

const OrderProductRepository =
  process.env.DB === mongo ? new OrderProductTypegooseRepository() : new OrderProductTypeOrmRepository();

export default OrderProductRepository;
