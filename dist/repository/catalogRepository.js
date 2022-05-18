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
const models_1 = require("../models");
const entity_1 = require("../entity");
const postgresql_1 = require("../db/postgresql");
const mongoose_1 = require("mongoose");
const apiError_1 = require("../error/apiError");
const express_validator_1 = require("express-validator");
const mongo = 'mongo';
class CategoryTypegooseRepository {
    all(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const category = yield models_1.MongoCategory.find({}, 'displayName');
                if (category.length > 0) {
                    res.send(category);
                }
                else {
                    throw new apiError_1.APIError(404, 'Category does not exist');
                }
            }
            catch (e) {
                res.sendStatus(500);
                return next(new Error('err'));
            }
        });
    }
    getCategory(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    throw new apiError_1.APIError(400, `Infalid query params: ${errors.array()[0].param}=${errors.array()[0].value}`);
                }
                const includeProducts = req.query.includeProducts === 'true';
                const includeTop3Products = req.query.includeTop3Products === 'true';
                let category = null;
                if (includeProducts) {
                    category = yield models_1.MongoCategory.aggregate([
                        {
                            $match: { _id: new mongoose_1.Types.ObjectId(req.params.id) }
                        },
                        { $project: { createdAt: 0 } },
                        {
                            $lookup: {
                                from: 'productclasses',
                                localField: '_id',
                                foreignField: 'categoryId',
                                as: 'products',
                                pipeline: includeTop3Products
                                    ? [
                                        { $project: { displayName: 1, price: 1, totalRating: 1, _id: 0 } },
                                        { $sort: { totalRating: -1 } },
                                        { $limit: 3 }
                                    ]
                                    : [{ $project: { displayName: 1, price: 1, totalRating: 1, _id: 0 } }]
                            }
                        }
                    ]);
                }
                else {
                    category = yield models_1.MongoCategory.find({ _id: req.params.id }, 'displayName');
                }
                if (category.length > 0) {
                    res.send(category);
                }
                else {
                    throw new apiError_1.APIError(404, 'Category does not exist');
                }
            }
            catch (e) {
                return next(e);
            }
        });
    }
    addCategory(categoryData) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield models_1.MongoCategory.create({
                displayName: categoryData.displayName,
                createdAt: Date.now()
            });
            return category;
        });
    }
    deleteCategoryById(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield models_1.MongoCategory.findOneAndDelete({ _id: categoryId });
            return category;
        });
    }
    updateCategory(categoryId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield models_1.MongoCategory.findOneAndUpdate({ _id: categoryId }, data, {
                returnDocument: 'after'
            });
            return product;
        });
    }
}
class CategoryTypeOrmRepository {
    all(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const category = yield postgresql_1.AppDataSource.manager.find(entity_1.SQLCategory);
                res.send(category);
            }
            catch (e) {
                res.sendStatus(500);
            }
        });
    }
    getCategory(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    throw new apiError_1.APIError(400, `Infalid query params: ${errors.array()[0].param}=${errors.array()[0].value}`);
                }
                const includeProducts = req.query.includeProducts === 'true';
                const includeTop3Products = req.query.includeTop3Products === 'true';
                const categoryId = +req.params.id;
                let category = null;
                if (includeProducts) {
                    category = yield postgresql_1.AppDataSource.manager.findOne(entity_1.SQLCategory, {
                        where: {
                            id: categoryId
                        },
                        select: ['id', 'displayName']
                    });
                    if (category) {
                        const findOptions = {
                            where: {
                                categoryId: category
                            },
                            select: ['id', 'displayName', 'price', 'totalRating']
                        };
                        if (includeTop3Products) {
                            findOptions.order = {
                                totalRating: 'desc'
                            };
                            findOptions.take = 3;
                        }
                        category.products = yield postgresql_1.AppDataSource.manager.find(entity_1.SQLProduct, findOptions);
                    }
                }
                else {
                    category = yield postgresql_1.AppDataSource.manager.findOne(entity_1.SQLCategory, {
                        where: {
                            id: +req.params.id
                        }
                    });
                }
                if (category instanceof Object) {
                    res.send(category);
                }
                else {
                    throw new apiError_1.APIError(404, 'Category does not exist');
                }
            }
            catch (e) {
                return next(e);
            }
        });
    }
    addCategory(categoryData) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield postgresql_1.AppDataSource.manager.save(entity_1.SQLCategory, {
                displayName: categoryData.displayName
            });
            return category;
        });
    }
    deleteCategoryById(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield postgresql_1.AppDataSource.manager.remove(entity_1.SQLCategory, { id: +categoryId });
            return `Category ${categoryId} deleted`;
        });
    }
    updateCategory(categoryId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield postgresql_1.AppDataSource.manager.findOneBy(entity_1.SQLCategory, { id: +categoryId });
            const newCategory = yield postgresql_1.AppDataSource.manager.save(entity_1.SQLCategory, {
                id: category === null || category === void 0 ? void 0 : category.id,
                displayName: data.displayName
            });
            return newCategory;
        });
    }
}
const CategoryRepository = process.env.DB === mongo ? new CategoryTypegooseRepository() : new CategoryTypeOrmRepository();
exports.default = CategoryRepository;
//# sourceMappingURL=catalogRepository.js.map