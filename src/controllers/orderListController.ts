import { Request, Response, NextFunction } from 'express';
import { IOrderListController } from '../types/types';
import { APIError } from '../error/apiError';
import { OrderListRepository, OrderProductRepository } from '../repository';

class OrderListController implements IOrderListController {
  async addProductToOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const user = res.locals.user;
      const products = req.body.products;
      let response;

      const order = await OrderListRepository.getOrderByUserId(user.userId);

      if (order) {
        const productIds = [];

        for (const product of products) {
          const dbProduct = await OrderProductRepository.updateOrInsertProduct(
            { productId: product.productId, orderListId: order._id },
            { quantity: product.quantity }
          );
          productIds.push(dbProduct._id);
        }
        response = await OrderListRepository.updateOrderProducts(order, productIds);
      } else {
        const order = await OrderListRepository.createOrder(user.userId);
        if (order) {
          const productsPayload = products.map((product: any) => {
            product.orderListId = order._id;
            return product;
          });

          const dbProducts = await OrderProductRepository.addProducts(productsPayload);

          const productIds = dbProducts.map((product) => {
            return product._id;
          });

          response = await OrderListRepository.updateOrderProducts(order, productIds);
        }
      }

      res.status(200).send({ response, authenticate: res.locals.token });
    } catch (e) {
      return next(e);
    }
  }

  async updateOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const user = res.locals.user;
      const products = req.body.products;
      let response;

      const order = await OrderListRepository.getOrderByUserId(user.userId);

      if (order) {
        response = await OrderProductRepository.updateProducts(order, products);
      } else {
        throw new APIError(404, 'Order does not exists');
      }
      res.status(200).send({ response, authenticate: res.locals.token });
    } catch (e) {
      next(e);
    }
  }

  async deleteOrderList(req: Request, res: Response, next: NextFunction) {
    try {
      const user = res.locals.user;

      const order = await OrderListRepository.getOrderByUserId(user.userId);

      if (order) {
        await OrderProductRepository.deleteAllProducts(order);
        await OrderListRepository.deleteOrderById(order._id);
      } else {
        throw new APIError(404, 'Order List does not exist');
      }

      res.status(200).send({ order, authenticate: res.locals.token });
    } catch (e) {
      next(e);
    }
  }
}

export default new OrderListController();
