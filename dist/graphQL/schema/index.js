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
const graphql_1 = require("graphql");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../../config");
const repository_1 = require("../../repository");
const sessionRepository_1 = __importDefault(require("../../repository/sessionRepository"));
const apiError_1 = require("../../error/apiError");
const generateTokens = (userId, userRole) => {
    const accessToken = jsonwebtoken_1.default.sign({ userId, userRole }, config_1.JWT_ACCESS_SECTER_KEY, { expiresIn: '15m' });
    const refreshToken = jsonwebtoken_1.default.sign({ userId, userRole }, config_1.JWT_REFRESH_SECTER_KEY, { expiresIn: '50d' });
    return {
        accessToken,
        refreshToken
    };
};
const UserType = new graphql_1.GraphQLObjectType({
    name: 'User',
    fields: () => ({
        _id: { type: graphql_1.GraphQLID },
        userName: { type: graphql_1.GraphQLString },
        password: { type: graphql_1.GraphQLString }
    })
});
const Query = new graphql_1.GraphQLObjectType({
    name: 'Query',
    fields: {
        getUsers: {
            type: new graphql_1.GraphQLList(UserType),
            resolve(parent, args) {
                return 'users';
            }
        }
    }
});
const Mutation = new graphql_1.GraphQLObjectType({
    name: 'Mutation',
    fields: {
        register: {
            type: graphql_1.GraphQLString,
            args: {
                userName: { type: graphql_1.GraphQLString },
                password: { type: graphql_1.GraphQLString },
                firstName: { type: graphql_1.GraphQLString, defaultValue: null },
                lastName: { type: graphql_1.GraphQLString, defaultValue: null }
            },
            resolve(parent, { userName, password, firstName, lastName }, { req, res }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const user = yield repository_1.UserRepository.getUser({ userName });
                    if (user) {
                        res.status(403);
                        throw new Error('USER_ALREADY_EXISTS');
                    }
                    const hashedPass = yield bcrypt_1.default.hash(password, 10);
                    yield repository_1.UserRepository.addUser({ userName, password: hashedPass, firstName, lastName });
                    return `User ${userName} added`;
                });
            }
        },
        authenticate: {
            type: graphql_1.GraphQLString,
            args: {
                userName: { type: graphql_1.GraphQLString },
                password: { type: graphql_1.GraphQLString }
            },
            resolve(parent, { userName, password }, { req, res }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const user = yield repository_1.UserRepository.getUser({ userName });
                    if (!user) {
                        res.status(401);
                        throw new Error('USER_NOT_FOUND');
                    }
                    const isValidPassword = yield bcrypt_1.default.compare(password, user.password || '');
                    if (isValidPassword) {
                        const { accessToken, refreshToken } = generateTokens(user._id, user.role);
                        res.cookie('RefreshToken', refreshToken, { httpOnly: true });
                        const sessionsForUser = yield sessionRepository_1.default.getCountByField({ userName });
                        if (sessionsForUser >= 5) {
                            yield sessionRepository_1.default.findOneAndDelete({ userName }, { id: -1 });
                        }
                        yield sessionRepository_1.default.addSession({ userName, refreshToken });
                        return accessToken;
                    }
                    else {
                        res.status(401);
                        throw new Error('INCORRECT_PASSWORD');
                    }
                });
            }
        },
        token: {
            type: graphql_1.GraphQLString,
            resolve(parent, args, { req, res }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const cookieTocken = req.headers.cookie.split('=')[1];
                    const session = yield sessionRepository_1.default.getSession({ refreshToken: cookieTocken });
                    if (session) {
                        const user = yield repository_1.UserRepository.getUser({ userName: session.userName });
                        if (user) {
                            const { accessToken, refreshToken } = generateTokens(user._id, user.role);
                            res.cookie('RefreshToken', refreshToken, { httpOnly: true });
                            sessionRepository_1.default.updateOne({ refreshToken: cookieTocken }, { refreshToken });
                            return accessToken;
                        }
                    }
                    return 'reject';
                });
            }
        },
        profile: {
            type: graphql_1.GraphQLString,
            args: {
                accessToken: { type: graphql_1.GraphQLString },
                firstName: { type: graphql_1.GraphQLString, defaultValue: null },
                lastName: { type: graphql_1.GraphQLString, defaultValue: null }
            },
            resolve(parent, { accessToken, firstName, lastName }, { res }) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        const jwtData = jsonwebtoken_1.default.verify(accessToken, config_1.JWT_ACCESS_SECTER_KEY);
                        if (jwtData) {
                            const newData = {};
                            firstName && (newData.firstName = firstName);
                            lastName && (newData.lastName = lastName);
                            yield repository_1.UserRepository.updateOne({ _id: jwtData.userId }, newData);
                            return JSON.stringify(newData);
                        }
                    }
                    catch (e) {
                        res.status(400);
                        throw new Error(e);
                    }
                });
            }
        },
        profilePassword: {
            type: graphql_1.GraphQLString,
            args: {
                accessToken: { type: graphql_1.GraphQLString },
                password: { type: graphql_1.GraphQLString }
            },
            resolve(parent, { accessToken, password }, { res }) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        const jwtData = jsonwebtoken_1.default.verify(accessToken, config_1.JWT_ACCESS_SECTER_KEY);
                        if (jwtData) {
                            const hashedPass = yield bcrypt_1.default.hash(password, 10);
                            yield repository_1.UserRepository.updateOne({ _id: jwtData.userId }, { password: hashedPass });
                            return 'Password successfully changed';
                        }
                    }
                    catch (e) {
                        res.status(400);
                        throw new Error(e.message);
                    }
                });
            }
        },
        rateProduct: {
            type: graphql_1.GraphQLString,
            args: {
                accessToken: { type: graphql_1.GraphQLString },
                productId: { type: graphql_1.GraphQLString },
                rating: { type: graphql_1.GraphQLInt }
            },
            resolve(parent, { accessToken, productId, rating }, { res }) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        if (!(rating >= 0 && rating <= 10)) {
                            throw new apiError_1.APIError(400, 'INVALID_PARAMS');
                        }
                        const user = jsonwebtoken_1.default.verify(accessToken, config_1.JWT_ACCESS_SECTER_KEY);
                        if (user.userRole === 'buyer') {
                            const ratedProduct = yield repository_1.ProductRepository.getProductById(productId);
                            const ratings = [];
                            if (ratedProduct) {
                                const applyedRatings = ratedProduct.ratings || [];
                                ratings.push(...applyedRatings);
                                let isRated = false;
                                ratings.map((ratingObj) => {
                                    if (ratingObj.userId === user.userId) {
                                        isRated = true;
                                        return (ratingObj.rating = rating);
                                    }
                                    return rating;
                                });
                                if (!isRated) {
                                    ratings.push({ userId: user.userId, rating: rating });
                                }
                            }
                            else {
                                throw new apiError_1.APIError(404, 'PRODUCT_NOT_FOUND');
                            }
                            const newProduct = yield repository_1.ProductRepository.updateRatings(productId, user.userId, ratings);
                            repository_1.ProductRepository.updateTotalRating(productId);
                            return JSON.stringify(newProduct);
                        }
                    }
                    catch (e) {
                        if (e.statusCode) {
                            res.status(e.statusCode);
                        }
                        throw new Error(e.message);
                    }
                });
            }
        },
        unrateProduct: {
            type: graphql_1.GraphQLString,
            args: {
                accessToken: { type: graphql_1.GraphQLString },
                productId: { type: graphql_1.GraphQLString }
            },
            resolve(parent, { accessToken, productId }, { res }) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        const user = jsonwebtoken_1.default.verify(accessToken, config_1.JWT_ACCESS_SECTER_KEY);
                        if (user.userRole === 'buyer') {
                            yield repository_1.ProductRepository.deleteRating(productId, user.userId);
                            return 'success';
                        }
                    }
                    catch (e) {
                        if (e.statusCode) {
                            res.status(e.statusCode);
                        }
                        throw new Error(e.message);
                    }
                });
            }
        }
    }
});
exports.default = new graphql_1.GraphQLSchema({
    query: Query,
    mutation: Mutation
});
//# sourceMappingURL=index.js.map