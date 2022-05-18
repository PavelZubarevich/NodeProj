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
exports.SQLProduct = void 0;
const typeorm_1 = require("typeorm");
const _1 = require("./");
let SQLProduct = class SQLProduct {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], SQLProduct.prototype, "_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], SQLProduct.prototype, "displayName", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], SQLProduct.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SQLProduct.prototype, "totalRating", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SQLProduct.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => _1.SQLCategory, (category) => category.products),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], SQLProduct.prototype, "categoryId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => _1.SQLUserRating, (rating) => rating.productId),
    __metadata("design:type", Array)
], SQLProduct.prototype, "ratings", void 0);
SQLProduct = __decorate([
    (0, typeorm_1.Entity)()
], SQLProduct);
exports.SQLProduct = SQLProduct;
//# sourceMappingURL=Product.js.map