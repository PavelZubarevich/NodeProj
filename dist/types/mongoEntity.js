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
exports.LastRating = exports.OrderProduct = exports.OrderListClass = exports.ProductClass = exports.CategoryClass = exports.UserClass = exports.SessionsClass = void 0;
const typegoose_1 = require("@typegoose/typegoose");
class SessionsClass {
}
__decorate([
    (0, typegoose_1.prop)({ require: true }),
    __metadata("design:type", String)
], SessionsClass.prototype, "userName", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], SessionsClass.prototype, "refreshToken", void 0);
exports.SessionsClass = SessionsClass;
class UserClass {
}
__decorate([
    (0, typegoose_1.prop)({ unique: true, require: true }),
    __metadata("design:type", String)
], UserClass.prototype, "userName", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], UserClass.prototype, "password", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], UserClass.prototype, "firstName", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], UserClass.prototype, "lastName", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: 'buyer' }),
    __metadata("design:type", String)
], UserClass.prototype, "role", void 0);
exports.UserClass = UserClass;
class CategoryClass {
}
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], CategoryClass.prototype, "displayName", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: Date.now() }),
    __metadata("design:type", Date)
], CategoryClass.prototype, "createdAt", void 0);
exports.CategoryClass = CategoryClass;
let ProductClass = class ProductClass {
};
__decorate([
    (0, typegoose_1.prop)({ unique: true, required: true }),
    __metadata("design:type", String)
], ProductClass.prototype, "displayName", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => CategoryClass }),
    __metadata("design:type", Array)
], ProductClass.prototype, "categoryId", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: Date.now() }),
    __metadata("design:type", Date)
], ProductClass.prototype, "createdAt", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Number)
], ProductClass.prototype, "totalRating", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", Number)
], ProductClass.prototype, "price", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Array)
], ProductClass.prototype, "ratings", void 0);
ProductClass = __decorate([
    (0, typegoose_1.modelOptions)({ options: { allowMixed: typegoose_1.Severity.ALLOW } }),
    (0, typegoose_1.index)({ totalRating: 1 }),
    (0, typegoose_1.index)({ price: 1 })
], ProductClass);
exports.ProductClass = ProductClass;
class OrderListClass {
}
__decorate([
    (0, typegoose_1.prop)({ ref: () => OrderProduct }),
    __metadata("design:type", Array)
], OrderListClass.prototype, "products", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => UserClass, required: true, unique: true }),
    __metadata("design:type", Object)
], OrderListClass.prototype, "userId", void 0);
exports.OrderListClass = OrderListClass;
class OrderProduct {
}
__decorate([
    (0, typegoose_1.prop)({ ref: () => ProductClass, required: true }),
    __metadata("design:type", Object)
], OrderProduct.prototype, "productId", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => OrderListClass, required: true }),
    __metadata("design:type", Object)
], OrderProduct.prototype, "orderListId", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", Number)
], OrderProduct.prototype, "quantity", void 0);
exports.OrderProduct = OrderProduct;
class LastRating {
}
__decorate([
    (0, typegoose_1.prop)({ ref: () => UserClass, required: true }),
    __metadata("design:type", Object)
], LastRating.prototype, "userId", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => ProductClass, required: true }),
    __metadata("design:type", Object)
], LastRating.prototype, "productId", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", Number)
], LastRating.prototype, "rating", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: Date.now() }),
    __metadata("design:type", Date)
], LastRating.prototype, "createdAt", void 0);
exports.LastRating = LastRating;
//# sourceMappingURL=mongoEntity.js.map