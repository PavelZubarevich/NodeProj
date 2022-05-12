"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoLastRatings = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const mongoEntity_1 = require("../types/mongoEntity");
exports.MongoLastRatings = (0, typegoose_1.getModelForClass)(mongoEntity_1.LastRating);
//# sourceMappingURL=lastRatings.js.map