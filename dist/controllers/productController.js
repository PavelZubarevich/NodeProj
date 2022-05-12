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
const repository_1 = require("../repository");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const apiError_1 = require("../error/apiError");
const express_validator_1 = require("express-validator");
const ws_1 = require("ws");
const ws = new ws_1.WebSocket('ws://localhost:8080');
class ProductController {
    rateProduct(req, res, next) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    throw new apiError_1.APIError(400, `Infalid body params: ${errors.array()[0].param}=${errors.array()[0].value}`);
                }
                const token = ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]) || '';
                const user = jsonwebtoken_1.default.verify(token, config_1.JWT_ACCESS_SECTER_KEY);
                if (user.userRole === 'buyer') {
                    const ratedProduct = yield repository_1.ProductRepository.getProductById(req.params.id);
                    const ratings = [];
                    if (ratedProduct) {
                        const applyedRatings = ratedProduct.ratings || [];
                        ratings.push(...applyedRatings);
                        let isRated = false;
                        ratings.map((rating) => {
                            if (rating.userId === user.userId) {
                                isRated = true;
                                rating.rating = +req.body.rating;
                                rating.createdAt = new Date();
                                return rating;
                            }
                            return rating;
                        });
                        if (!isRated) {
                            ratings.push({
                                userId: user.userId,
                                rating: +req.body.rating,
                                createdAt: new Date()
                            });
                        }
                    }
                    else {
                        throw new apiError_1.APIError(404, 'Product does not exist');
                    }
                    const newProduct = yield repository_1.ProductRepository.updateRatings(req.params.id, user.userId, ratings);
                    ws.send('');
                    res.status(200).send(newProduct);
                }
                else {
                    throw new apiError_1.APIError(401, 'Buyers only');
                }
            }
            catch (e) {
                return next(e);
            }
        });
    }
    deleteRating(req, res, next) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]) || '';
                const user = jsonwebtoken_1.default.verify(token, config_1.JWT_ACCESS_SECTER_KEY);
                if (user.userRole === 'buyer') {
                    yield repository_1.ProductRepository.deleteRating(req.params.id, user.userId);
                    res.status(200).send('success');
                }
            }
            catch (e) {
                return next(e);
            }
        });
    }
    getProductById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const product = yield repository_1.ProductRepository.getProductById(req.params.id);
                res.status(200).send(product);
            }
            catch (e) {
                return next(e);
            }
        });
    }
    addProduct(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const product = yield repository_1.ProductRepository.addProduct(req.body);
                res.status(200).send(product);
            }
            catch (e) {
                next(e);
            }
        });
    }
    deleteProduct(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const product = yield repository_1.ProductRepository.deleteProductById(req.params.id);
                if (!product) {
                    throw new apiError_1.APIError(404, 'Product does not exist');
                }
                res.status(200).send(product);
            }
            catch (e) {
                next(e);
            }
        });
    }
    updateProduct(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const product = yield repository_1.ProductRepository.updateProduct(req.params.id, req.body);
                res.status(200).send(product);
            }
            catch (e) {
                next(e);
            }
        });
    }
}
exports.default = new ProductController();
//# sourceMappingURL=productController.js.map