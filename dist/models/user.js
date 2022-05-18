"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoUser = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const mongoEntity_1 = require("../types/mongoEntity");
exports.MongoUser = (0, typegoose_1.getModelForClass)(mongoEntity_1.UserClass);
//# sourceMappingURL=user.js.map