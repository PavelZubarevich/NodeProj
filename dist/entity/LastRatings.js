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
exports.SQLLastRating = void 0;
const typeorm_1 = require("typeorm");
const _1 = require(".");
const User_1 = require("./User");
let SQLLastRating = class SQLLastRating {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], SQLLastRating.prototype, "_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.SQLUser, (user) => user.ratings),
    __metadata("design:type", User_1.SQLUser)
], SQLLastRating.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => _1.SQLProduct, (product) => product.ratings),
    __metadata("design:type", _1.SQLProduct)
], SQLLastRating.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SQLLastRating.prototype, "rating", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], SQLLastRating.prototype, "createdAt", void 0);
SQLLastRating = __decorate([
    (0, typeorm_1.Entity)()
], SQLLastRating);
exports.SQLLastRating = SQLLastRating;
//# sourceMappingURL=LastRatings.js.map