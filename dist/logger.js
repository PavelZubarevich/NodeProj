"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBsLogger = exports.APILogger = void 0;
const winston_1 = require("winston");
const express_winston_1 = __importDefault(require("express-winston"));
const APILogger = express_winston_1.default.logger({
    transports: [new winston_1.transports.File({ filename: 'logs/API.log' })]
});
exports.APILogger = APILogger;
const DBsLogger = (0, winston_1.createLogger)({
    transports: [new winston_1.transports.File({ filename: 'logs/DBs.log' })]
});
exports.DBsLogger = DBsLogger;
//# sourceMappingURL=logger.js.map