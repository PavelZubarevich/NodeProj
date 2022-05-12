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
const repository_1 = require("../repository");
class ProductRatingsController {
    getLatestRatings(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const ratings = yield repository_1.ProductRatingsRepository.getLatestRatings();
            res.status(200).send(ratings);
        });
    }
    deleteRatings() {
        return __awaiter(this, void 0, void 0, function* () {
            yield repository_1.ProductRatingsRepository.deleteRatings();
        });
    }
}
exports.default = new ProductRatingsController();
//# sourceMappingURL=productRatingsController.js.map