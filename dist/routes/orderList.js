"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const controllers_1 = require("../controllers");
const orderListRouter = (0, express_1.Router)();
orderListRouter.post('/', (0, express_validator_1.body)('products').custom((value) => {
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
}), controllers_1.OrderListController.addProductToOrder);
orderListRouter.put('/', (0, express_validator_1.body)('products').custom((value) => {
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
}), controllers_1.OrderListController.updateOrder);
orderListRouter.post('/clear', controllers_1.OrderListController.deleteOrderList);
exports.default = orderListRouter;
//# sourceMappingURL=orderList.js.map