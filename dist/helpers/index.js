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
exports.updateTokens = exports.validateQueryDataMiddleware = exports.verifyAdminMiddleware = exports.verifyUserMiddleware = exports.verifyUser = exports.generateTokens = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const apiError_1 = require("../error/apiError");
const express_validator_1 = require("express-validator");
const sessionRepository_1 = __importDefault(require("../repository/sessionRepository"));
const repository_1 = require("../repository");
const generateTokens = (userId, userRole) => {
    const accessToken = jsonwebtoken_1.default.sign({ userId, userRole }, config_1.JWT_ACCESS_SECTER_KEY, { expiresIn: '15m' });
    const refreshToken = jsonwebtoken_1.default.sign({ userId, userRole }, config_1.JWT_REFRESH_SECTER_KEY, { expiresIn: '50d' });
    return {
        accessToken,
        refreshToken
    };
};
exports.generateTokens = generateTokens;
const verifyUser = (token) => {
    if (token) {
        token = token.split(' ')[1] || '';
        const user = jsonwebtoken_1.default.verify(token, config_1.JWT_ACCESS_SECTER_KEY);
        return user;
    }
    else {
        throw new apiError_1.APIError(401, 'Token not provided');
    }
};
exports.verifyUser = verifyUser;
const verifyUserMiddleware = (req, res, next) => {
    var _a;
    const token = ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]) || '';
    const user = jsonwebtoken_1.default.verify(token, config_1.JWT_ACCESS_SECTER_KEY);
    res.locals.user = user;
    next();
};
exports.verifyUserMiddleware = verifyUserMiddleware;
const verifyAdminMiddleware = (req, res, next) => {
    var _a;
    const token = ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]) || '';
    const user = jsonwebtoken_1.default.verify(token, config_1.JWT_ACCESS_SECTER_KEY);
    if (user.userRole === 'admin') {
        res.locals.user = user;
    }
    else {
        throw new apiError_1.APIError(403, 'Admins only');
    }
    next();
};
exports.verifyAdminMiddleware = verifyAdminMiddleware;
const validateQueryDataMiddleware = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        throw new apiError_1.APIError(400, `Infalid params: ${errors.array()[0].param}=${errors.array()[0].value}`);
    }
    next();
};
exports.validateQueryDataMiddleware = validateQueryDataMiddleware;
const updateTokens = (req, res, next) => {
    var _a;
    const accessToken = ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]) || '';
    jsonwebtoken_1.default.verify(accessToken, config_1.JWT_ACCESS_SECTER_KEY, (err) => __awaiter(void 0, void 0, void 0, function* () {
        var _b;
        if ((err === null || err === void 0 ? void 0 : err.message) === 'jwt expired') {
            const cookieToken = (_b = req.headers.cookie) === null || _b === void 0 ? void 0 : _b.split('=')[1];
            const session = yield sessionRepository_1.default.getSession({ refreshToken: cookieToken });
            if (session) {
                const user = yield repository_1.UserRepository.getUser({ userName: session.userName });
                if (user) {
                    const { accessToken, refreshToken } = (0, exports.generateTokens)(user._id, user.role);
                    res.cookie('RefreshToken', refreshToken, { httpOnly: true });
                    yield sessionRepository_1.default.updateOne({ refreshToken: cookieToken }, { refreshToken });
                    req.headers.authorization = `Bearer ${accessToken}`;
                }
            }
            next();
        }
        else {
            next();
        }
    }));
};
exports.updateTokens = updateTokens;
//# sourceMappingURL=index.js.map