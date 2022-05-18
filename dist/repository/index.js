"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRatingsRepository = exports.OrderProductRepository = exports.OrderListRepository = exports.UserRepository = exports.CategoryRepository = exports.ProductRepository = void 0;
const productRepository_1 = __importDefault(require("./productRepository"));
exports.ProductRepository = productRepository_1.default;
const catalogRepository_1 = __importDefault(require("./catalogRepository"));
exports.CategoryRepository = catalogRepository_1.default;
const userRepository_1 = __importDefault(require("./userRepository"));
exports.UserRepository = userRepository_1.default;
const orderListRepository_1 = __importDefault(require("./orderListRepository"));
exports.OrderListRepository = orderListRepository_1.default;
const orderProductRepository_1 = __importDefault(require("./orderProductRepository"));
exports.OrderProductRepository = orderProductRepository_1.default;
const productRatingsRepository_1 = __importDefault(require("./productRatingsRepository"));
exports.ProductRatingsRepository = productRatingsRepository_1.default;
//# sourceMappingURL=index.js.map