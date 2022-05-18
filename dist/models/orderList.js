"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoOrderList = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const mongoEntity_1 = require("../types/mongoEntity");
exports.MongoOrderList = (0, typegoose_1.getModelForClass)(mongoEntity_1.OrderListClass);
//# sourceMappingURL=orderList.js.map