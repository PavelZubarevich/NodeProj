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
const postgresql_1 = require("../db/postgresql");
const entity_1 = require("../entity");
const OrderProduct_1 = require("../entity/OrderProduct");
const models_1 = require("../models");
const mongo = 'mongo';
class OrderProductTypegooseRepository {
    addProducts(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const products = yield models_1.MongoOrderProduct.insertMany(params);
            return products;
        });
    }
    updateProduct(findParams, updateParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield models_1.MongoOrderProduct.findOneAndUpdate(findParams, updateParams, {
                returnDocument: 'after'
            });
            return product;
        });
    }
    updateOrInsertProduct(findParams, updateParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield models_1.MongoOrderProduct.findOneAndUpdate(findParams, updateParams, {
                upsert: true,
                returnDocument: 'after'
            });
            return product;
        });
    }
    updateProducts(order, products) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = [];
            for (const product of products) {
                const dbProduct = yield this.updateProduct({ productId: product.productId, orderListId: order._id }, { quantity: product.quantity });
                response.push(dbProduct);
            }
            return response;
        });
    }
    deleteAllProducts(order) {
        return __awaiter(this, void 0, void 0, function* () {
            yield models_1.MongoOrderProduct.deleteMany({ orderListId: order._id });
        });
    }
}
class OrderProductTypeOrmRepository {
    addProducts(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const productsPayload = [];
            for (const product of params) {
                productsPayload.push({
                    productId: yield postgresql_1.AppDataSource.manager.findOneByOrFail(entity_1.SQLProduct, { _id: +(product.productId || 0) }),
                    orderListId: yield postgresql_1.AppDataSource.manager.findOneByOrFail(entity_1.SQLOrderList, { _id: +(product.orderListId || 0) }),
                    quantity: product.quantity
                });
            }
            const products = yield postgresql_1.AppDataSource.manager.save(OrderProduct_1.SQLOrderProduct, [...productsPayload]);
            return products;
        });
    }
    updateProduct(findParams, updateParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield postgresql_1.AppDataSource.manager.update(OrderProduct_1.SQLOrderProduct, findParams, updateParams);
            return product;
        });
    }
    updateOrInsertProduct(findParams, updateParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield postgresql_1.AppDataSource.manager.findOne(OrderProduct_1.SQLOrderProduct, {
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
                newProduct = yield postgresql_1.AppDataSource.manager.save(OrderProduct_1.SQLOrderProduct, {
                    _id: product._id,
                    orderListId: product.orderListId,
                    productId: product.productId,
                    quantity: updateParams.quantity
                });
            }
            else {
                newProduct = yield postgresql_1.AppDataSource.manager.save(OrderProduct_1.SQLOrderProduct, {
                    orderListId: yield postgresql_1.AppDataSource.manager.findOneByOrFail(entity_1.SQLOrderList, { _id: findParams.orderListId }),
                    productId: findParams.productId,
                    quantity: updateParams.quantity
                });
            }
            return newProduct;
        });
    }
    updateProducts(order, products) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = [];
            for (const product of products) {
                const dbProduct = yield this.updateProduct({ productId: product.productId, orderListId: order._id }, { quantity: product.quantity });
                response.push(dbProduct);
            }
            return response;
        });
    }
    deleteAllProducts(order) {
        return __awaiter(this, void 0, void 0, function* () {
            yield postgresql_1.AppDataSource.manager.delete(OrderProduct_1.SQLOrderProduct, { orderListId: { _id: order._id } });
        });
    }
}
const OrderProductRepository = process.env.DB === mongo ? new OrderProductTypegooseRepository() : new OrderProductTypeOrmRepository();
exports.default = OrderProductRepository;
//# sourceMappingURL=orderProductRepository.js.map