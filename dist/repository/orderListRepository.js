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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const postgresql_1 = require("../db/postgresql");
const entity_1 = require("../entity");
const userRepository_1 = __importDefault(require("./userRepository"));
const mongo = 'mongo';
class OrderListTypegooseRepository {
    getOrderByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = yield models_1.MongoOrderList.findOne({ userId });
            return order;
        });
    }
    updateOrderProducts(order, productIds) {
        return __awaiter(this, void 0, void 0, function* () {
            productIds.forEach((productId) => {
                var _a, _b;
                if (!((_a = order.products) === null || _a === void 0 ? void 0 : _a.includes(productId))) {
                    (_b = order.products) === null || _b === void 0 ? void 0 : _b.push(productId);
                }
            });
            order.save();
            return order;
        });
    }
    deleteOrderById(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield models_1.MongoOrderList.deleteOne({ _id: orderId });
        });
    }
    createOrder(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = yield models_1.MongoOrderList.create({ userId });
            return order;
        });
    }
}
class OrderListTypeOrmRepository {
    getOrderByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield postgresql_1.AppDataSource.manager.findOne(entity_1.SQLOrderList, {
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
        });
    }
    updateOrderProducts(order, products) {
        return __awaiter(this, void 0, void 0, function* () {
            const newOrder = yield postgresql_1.AppDataSource.manager.findOne(entity_1.SQLOrderList, {
                relations: { products: true },
                where: { _id: order._id }
            });
            return newOrder;
        });
    }
    deleteOrderById(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield postgresql_1.AppDataSource.manager.delete(entity_1.SQLOrderList, orderId);
        });
    }
    createOrder(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userRepository_1.default.getUserById(userId);
            if (user) {
                const order = yield postgresql_1.AppDataSource.manager.save(entity_1.SQLOrderList, { userId: user });
                return order;
            }
        });
    }
}
const OrderListRepository = process.env.DB === mongo ? new OrderListTypegooseRepository() : new OrderListTypeOrmRepository();
exports.default = OrderListRepository;
//# sourceMappingURL=orderListRepository.js.map