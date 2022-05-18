"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRouter = exports.orderListRouter = exports.categoryRouter = exports.productRouter = void 0;
const product_1 = __importDefault(require("./product"));
exports.productRouter = product_1.default;
const category_1 = __importDefault(require("./category"));
exports.categoryRouter = category_1.default;
const orderList_1 = __importDefault(require("./orderList"));
exports.orderListRouter = orderList_1.default;
const admin_1 = __importDefault(require("./admin"));
exports.adminRouter = admin_1.default;
//# sourceMappingURL=index.js.map