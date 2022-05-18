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
const entity_1 = require("../entity");
const postgresql_1 = require("../db/postgresql");
const typeorm_1 = require("typeorm");
const apiError_1 = require("../error/apiError");
const express_validator_1 = require("express-validator");
const mongoose_1 = __importDefault(require("mongoose"));
const mongo = 'mongo';
class ProductTypegooseRepository {
    all(req, res, next) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    throw new apiError_1.APIError(400, `Infalid query params: ${errors.array()[0].param}=${errors.array()[0].value}`);
                }
                const query = req.query;
                const displayNameReg = new RegExp(`${query.displayName}`);
                const prices = ((_a = query.price) === null || _a === void 0 ? void 0 : _a.toString().split(':')) || [];
                const findProps = {};
                const skip = +(query.offset || 0);
                const limit = +(query.limit || Infinity);
                query.displayName && (findProps.displayName = displayNameReg);
                query.minRating && (findProps.totalRating = { $gt: query.minRating });
                if (prices[0] || prices[1]) {
                    const totalRatingFilter = {};
                    +prices[0] && (totalRatingFilter.$gt = +prices[0]);
                    +prices[1] && (totalRatingFilter.$lt = +prices[1]);
                    findProps.price = totalRatingFilter;
                }
                const sortProps = {};
                const sortingParams = ((_b = query.sortBy) === null || _b === void 0 ? void 0 : _b.toString().split(':')) || [];
                if (sortingParams[0] && sortingParams[1]) {
                    sortProps[sortingParams[0]] = sortingParams[1];
                }
                const products = yield models_1.MongoProduct.find(findProps).sort(sortProps).skip(skip).limit(limit).exec();
                if (products.length > 0) {
                    res.send(products);
                }
                else {
                    throw new apiError_1.APIError(404, 'Product does not exist');
                }
            }
            catch (e) {
                return next(e);
            }
        });
    }
    getProductById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield models_1.MongoProduct.findById(id);
            if (!product) {
                throw new apiError_1.APIError(404, 'Product does not exist');
            }
            return product;
        });
    }
    updateRatings(id, userId, updateParams) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const product = yield models_1.MongoProduct.findOneAndUpdate({ _id: id }, {
                    $set: { ratings: updateParams }
                }, { returnDocument: 'after' });
                updateParams.forEach((param) => {
                    param.productId = product === null || product === void 0 ? void 0 : product._id;
                });
                yield models_1.MongoLastRatings.insertMany(updateParams);
                yield this.updateTotalRating(id);
                return product;
            }
            catch (e) {
                throw new apiError_1.APIError(500, 'Internal server error');
            }
        });
    }
    updateTotalRating(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [rating] = yield models_1.MongoProduct.aggregate([
                    { $match: { _id: new mongoose_1.default.Types.ObjectId(id) } },
                    { $unwind: '$ratings' },
                    {
                        $group: {
                            _id: null,
                            totalRating: { $sum: '$ratings.rating' }
                        }
                    }
                ]);
                let totalRating = 0;
                if (rating) {
                    totalRating = rating.totalRating;
                }
                yield models_1.MongoProduct.findOneAndUpdate({ _id: id }, {
                    $set: { totalRating }
                });
            }
            catch (e) {
                throw new apiError_1.APIError(500, 'Internal server error');
            }
        });
    }
    deleteRating(productId, userId) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const product = yield this.getProductById(productId);
                const ratings = ((_a = product === null || product === void 0 ? void 0 : product.ratings) === null || _a === void 0 ? void 0 : _a.filter((rating) => rating.userId !== userId)) || [];
                const newProduct = yield this.updateRatings(productId, userId, ratings);
                yield this.updateTotalRating(productId);
                return newProduct;
            }
            catch (e) {
                throw new apiError_1.APIError(500, 'Internal server error');
            }
        });
    }
    addProduct(productData) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield models_1.MongoProduct.create({
                displayName: productData.displayName,
                createdAt: Date.now(),
                categoryId: productData.categoryId,
                price: productData.price
            });
            return product;
        });
    }
    deleteProductById(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield models_1.MongoProduct.findOneAndDelete({ _id: productId });
            return product;
        });
    }
    updateProduct(productId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield models_1.MongoProduct.findOneAndUpdate({ _id: productId }, data, {
                returnDocument: 'after'
            });
            return product;
        });
    }
}
// ============================
class ProductTypeOrmRepository {
    all(req, res, next) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    throw new apiError_1.APIError(400, `Infalid query params: ${errors.array()[0].param}=${errors.array()[0].value}`);
                }
                const query = req.query;
                const priceString = ((_a = query.price) === null || _a === void 0 ? void 0 : _a.toString()) || ':';
                const [minPrice, maxPrice] = priceString.split(':').map((elem) => Number(elem));
                const sortString = ((_b = query.sortBy) === null || _b === void 0 ? void 0 : _b.toString()) || ':';
                const sortingParams = sortString.split(':');
                const sortProps = {};
                if (sortingParams[0] && sortingParams[1]) {
                    sortProps[sortingParams[0]] = sortingParams[1];
                }
                const findProps = {};
                const findWhereProps = {};
                query.displayName && (findWhereProps.displayName = (0, typeorm_1.Like)(`%${query.displayName}%`));
                query.minRating && (findWhereProps.totalRating = (0, typeorm_1.MoreThanOrEqual)(+query.minRating));
                minPrice === 0 && maxPrice !== 0 && (findWhereProps.price = (0, typeorm_1.LessThanOrEqual)(maxPrice));
                minPrice !== 0 && maxPrice === 0 && (findWhereProps.price = (0, typeorm_1.MoreThanOrEqual)(minPrice));
                minPrice !== 0 && maxPrice !== 0 && (findWhereProps.price = (0, typeorm_1.Between)(minPrice, maxPrice));
                findProps.where = findWhereProps;
                findProps.order = sortProps;
                query.offset && (findProps.skip = +query.offset);
                query.limit && (findProps.take = +query.limit);
                const products = yield postgresql_1.AppDataSource.manager.find(entity_1.SQLProduct, findProps);
                if (products.length > 0) {
                    res.send(products);
                }
                else {
                    throw new apiError_1.APIError(404, 'Product does not exist');
                }
                res.send(products);
            }
            catch (e) {
                return next(e);
            }
        });
    }
    getProductById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield postgresql_1.AppDataSource.manager.findOneBy(entity_1.SQLProduct, { _id: +id });
            if (!product) {
                throw new apiError_1.APIError(404, 'Product does not exist');
            }
            return product;
        });
    }
    updateRatings(id, userId, updateParams) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const ratedProduct = yield postgresql_1.AppDataSource.manager.findOneOrFail(entity_1.SQLProduct, {
                relations: { ratings: true },
                where: {
                    _id: +id,
                    ratings: {
                        userId: {
                            _id: +userId
                        }
                    }
                }
            });
            const userRatings = (ratedProduct === null || ratedProduct === void 0 ? void 0 : ratedProduct.ratings) || [];
            const userRatingId = (_a = userRatings[0]) === null || _a === void 0 ? void 0 : _a._id;
            if (userRatingId) {
                const product = yield postgresql_1.AppDataSource.manager.findOneOrFail(entity_1.SQLProduct, { where: { _id: +id } });
                yield postgresql_1.AppDataSource.manager.update(entity_1.SQLUserRating, {
                    _id: userRatingId
                }, {
                    rating: updateParams[0].rating
                });
                yield postgresql_1.AppDataSource.getRepository(entity_1.SQLLastRating).save({
                    userId: ratedProduct,
                    productId: product,
                    rating: updateParams[0].rating
                });
                yield this.updateTotalRating(id);
                return 'updated';
            }
            else {
                const user = yield postgresql_1.AppDataSource.manager.findOneOrFail(entity_1.SQLUser, { where: { _id: +userId } });
                const product = yield postgresql_1.AppDataSource.manager.findOneOrFail(entity_1.SQLProduct, { where: { _id: +id } });
                const rating = yield postgresql_1.AppDataSource.getRepository(entity_1.SQLUserRating).save({
                    userId: user,
                    productId: product,
                    rating: updateParams[0].rating
                });
                yield postgresql_1.AppDataSource.getRepository(entity_1.SQLLastRating).save({
                    userId: user,
                    productId: product,
                    rating: updateParams[0].rating
                });
                yield this.updateTotalRating(id);
                return rating;
            }
        });
    }
    updateTotalRating(id) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const productRating = (yield postgresql_1.AppDataSource.manager.findOne(entity_1.SQLProduct, {
                    relations: {
                        ratings: true
                    },
                    where: { _id: +id },
                    select: {
                        _id: true,
                        ratings: true
                    }
                })) || {};
                const totalRating = (_a = productRating.ratings) === null || _a === void 0 ? void 0 : _a.reduce((acc, elem) => {
                    return (acc += elem.rating || 0);
                }, 0);
                yield postgresql_1.AppDataSource.manager.update(entity_1.SQLProduct, { _id: +id }, { totalRating });
            }
            catch (e) {
                throw new apiError_1.APIError(500, 'Internal server error');
            }
        });
    }
    deleteRating(productId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield postgresql_1.AppDataSource.manager.delete(entity_1.SQLUserRating, {
                    userId: {
                        _id: +userId
                    },
                    productId: {
                        _id: +productId
                    }
                });
                yield this.updateTotalRating(productId);
            }
            catch (e) { }
        });
    }
    addProduct(productData) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const categories = [];
            if ((_a = productData.categoryId) === null || _a === void 0 ? void 0 : _a.length) {
                for (const categoryId of productData.categoryId) {
                    const category = yield postgresql_1.AppDataSource.manager.findOneBy(entity_1.SQLCategory, { id: +categoryId });
                    if (category) {
                        categories.push(category);
                    }
                    else {
                        throw new apiError_1.APIError(404, `Category ${categoryId} does noe exist`);
                    }
                }
            }
            const product = yield postgresql_1.AppDataSource.manager.save(entity_1.SQLProduct, {
                displayName: productData.displayName,
                price: productData.price,
                categoryId: categories,
                totalRating: 0
            });
            return product;
        });
    }
    deleteProductById(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield postgresql_1.AppDataSource.manager.remove(entity_1.SQLProduct, { _id: +productId });
            return `Product ${productId} deleted`;
        });
    }
    updateProduct(productId, data) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const categories = [];
            if ((_a = data.categoryId) === null || _a === void 0 ? void 0 : _a.length) {
                for (const categoryId of data.categoryId) {
                    const category = yield postgresql_1.AppDataSource.manager.findOneBy(entity_1.SQLCategory, { id: +categoryId });
                    if (category) {
                        categories.push(category);
                    }
                    else {
                        throw new apiError_1.APIError(404, `Category ${categoryId} does noe exist`);
                    }
                }
            }
            const product = yield postgresql_1.AppDataSource.manager.findOneBy(entity_1.SQLProduct, { _id: +productId });
            const newProduct = yield postgresql_1.AppDataSource.manager.save(entity_1.SQLProduct, {
                _id: product === null || product === void 0 ? void 0 : product._id,
                totalRating: product === null || product === void 0 ? void 0 : product.totalRating,
                ratings: product === null || product === void 0 ? void 0 : product.ratings,
                displayName: data.displayName,
                price: data.price,
                categoryId: categories
            });
            return newProduct;
        });
    }
}
const ProductRepository = process.env.DB === mongo ? new ProductTypegooseRepository() : new ProductTypeOrmRepository();
exports.default = ProductRepository;
//# sourceMappingURL=productRepository.js.map