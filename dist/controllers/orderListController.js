"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const apiError_1 = require("../error/apiError");
const express_validator_1 = require("express-validator");
const repository_1 = require("../repository");
class OrderListController {
    addProductToOrder(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    throw new apiError_1.APIError(400, `Infalid body params: ${errors.array()[0].param}=${errors.array()[0].value}`);
                }
                const user = res.locals.user;
                const products = req.body.products;
                let response;
                const order = yield repository_1.OrderListRepository.getOrderByUserId(user.userId);
                if (order) {
                    const productIds = [];
                    for (const product of products) {
                        const dbProduct = yield repository_1.OrderProductRepository.updateOrInsertProduct({ productId: product.productId, orderListId: order._id }, { quantity: product.quantity });
                        productIds.push(dbProduct._id);
                    }
                    response = yield repository_1.OrderListRepository.updateOrderProducts(order, productIds);
                }
                else {
                    const order = yield repository_1.OrderListRepository.createOrder(user.userId);
                    if (order) {
                        const productsPayload = products.map((product) => {
                            product.orderListId = order._id;
                            return product;
                        });
                        const dbProducts = yield repository_1.OrderProductRepository.addProducts(productsPayload);
                        const productIds = dbProducts.map((product) => {
                            return product._id;
                        });
                        response = yield repository_1.OrderListRepository.updateOrderProducts(order, productIds);
                    }
                }
                res.status(200).send(response);
            }
            catch (e) {
                return next(e);
            }
        });
    }
    updateOrder(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    throw new apiError_1.APIError(400, `Infalid body params: ${errors.array()[0].param}=${errors.array()[0].value}`);
                }
                const user = res.locals.user;
                const products = req.body.products;
                let response;
                const order = yield repository_1.OrderListRepository.getOrderByUserId(user.userId);
                if (order) {
                    response = yield repository_1.OrderProductRepository.updateProducts(order, products);
                }
                else {
                    throw new apiError_1.APIError(404, 'Order does not exists');
                }
                res.status(200).send(response);
            }
            catch (e) {
                next(e);
            }
        });
    }
    deleteOrderList(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = res.locals.user;
                const order = yield repository_1.OrderListRepository.getOrderByUserId(user.userId);
                if (order) {
                    yield repository_1.OrderProductRepository.deleteAllProducts(order);
                    yield repository_1.OrderListRepository.deleteOrderById(order._id);
                }
                else {
                    throw new apiError_1.APIError(404, 'Order List does not exist');
                }
                res.status(200).send(order);
            }
            catch (e) {
                next(e);
            }
        });
    }
}
exports.default = new OrderListController();
//# sourceMappingURL=orderListController.js.map