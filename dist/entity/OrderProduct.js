"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SQLOrderProduct = void 0;
const typeorm_1 = require("typeorm");
const OrderList_1 = require("./OrderList");
const Product_1 = require("./Product");
let SQLOrderProduct = class SQLOrderProduct {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], SQLOrderProduct.prototype, "_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Product_1.SQLProduct),
    __metadata("design:type", Product_1.SQLProduct)
], SQLOrderProduct.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => OrderList_1.SQLOrderList, (orderList) => orderList.products),
    __metadata("design:type", OrderList_1.SQLOrderList)
], SQLOrderProduct.prototype, "orderListId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SQLOrderProduct.prototype, "quantity", void 0);
SQLOrderProduct = __decorate([
    (0, typeorm_1.Entity)()
], SQLOrderProduct);
exports.SQLOrderProduct = SQLOrderProduct;
//# sourceMappingURL=OrderProduct.js.map