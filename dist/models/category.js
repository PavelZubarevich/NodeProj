"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoCategory = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const mongoEntity_1 = require("../types/mongoEntity");
exports.MongoCategory = (0, typegoose_1.getModelForClass)(mongoEntity_1.CategoryClass);
//# sourceMappingURL=category.js.map