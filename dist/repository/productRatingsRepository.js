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
const mongo = 'mongo';
class ProductRatingsTypegooseRepository {
    getLatestRatings() {
        return __awaiter(this, void 0, void 0, function* () {
            const ratings = yield models_1.MongoLastRatings.find().sort({ createdAt: -1 }).limit(10);
            return ratings;
        });
    }
    deleteRatings() {
        return __awaiter(this, void 0, void 0, function* () {
            yield models_1.MongoLastRatings.remove({
                _id: {
                    $in: (yield models_1.MongoLastRatings.find().sort({ createdAt: -1 }).skip(10)).map((a) => a._id)
                }
            });
        });
    }
}
// ============================
class ProductRatingsTypeOrmRepository {
    getLatestRatings() {
        return __awaiter(this, void 0, void 0, function* () {
            const ratings = yield postgresql_1.AppDataSource.manager.find(entity_1.SQLLastRating, {
                relations: { productId: true },
                order: { createdAt: -1 },
                take: 10
            });
            return ratings;
        });
    }
    deleteRatings() {
        return __awaiter(this, void 0, void 0, function* () {
            yield postgresql_1.AppDataSource.manager
                .getRepository(entity_1.SQLLastRating)
                .createQueryBuilder('last_ratings')
                .delete()
                .where((qb) => `_id IN (${qb
                .createQueryBuilder()
                .select('_id')
                .from(entity_1.SQLLastRating, 'last_ratings')
                .orderBy('last_ratings."createdAt"', 'DESC')
                .skip(10)
                .getQuery()})`)
                .execute();
        });
    }
}
const ProductRatingsRepository = process.env.DB === mongo ? new ProductRatingsTypegooseRepository() : new ProductRatingsTypeOrmRepository();
exports.default = ProductRatingsRepository;
//# sourceMappingURL=productRatingsRepository.js.map