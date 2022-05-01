import { Router } from 'express';
import { body } from 'express-validator';
import { OrderListController } from '../controllers';

const orderListRouter = Router();

orderListRouter.post(
  '/',
  body('products').custom((value) => {
    if (Array.isArray(value)) {
      let valid = true;
      value.forEach((product) => {
        if (!(Number.isInteger(product.quantity) && product.quantity > 0 && product.productId.length)) {
          valid = false;
        }
      });
      return valid;
    }
    return false;
  }),
  OrderListController.addProductToOrder
);

orderListRouter.put(
  '/',
  body('products').custom((value) => {
    if (Array.isArray(value)) {
      let valid = true;
      value.forEach((product) => {
        if (!(Number.isInteger(product.quantity) && product.quantity > 0 && product.productId.length)) {
          valid = false;
        }
      });
      return valid;
    }
    return false;
  }),
  OrderListController.updateOrder
);

orderListRouter.post('/clear', OrderListController.deleteOrderList);

export default orderListRouter;
