"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const repository_1 = require("../repository");
const express_validator_1 = require("express-validator");
const controllers_1 = require("../controllers");
const productRouter = (0, express_1.Router)();
productRouter.get('/', (0, express_validator_1.query)('displayName').isString().optional(), (0, express_validator_1.query)('minRating')
    .optional()
    .custom((value) => {
    if (!(value === '' || +value >= 0)) {
        throw new Error();
    }
    return true;
}), (0, express_validator_1.query)('price')
    .custom((value) => {
    const priceString = value || ':';
    const [minPrice, maxPrice] = priceString.split(':');
    if (!((+minPrice >= 0 || minPrice === '') && (+maxPrice >= 0 || maxPrice === ''))) {
        throw new Error();
    }
    return true;
})
    .optional(), (0, express_validator_1.query)('sortBy')
    .custom((value) => {
    const sortByParam = value || ':';
    const sortDirection = sortByParam.split(':')[1].toLowerCase();
    if (!(sortDirection === 'asc' || sortDirection === 'desc' || sortDirection === '')) {
        throw new Error();
    }
    return true;
})
    .optional(), repository_1.ProductRepository.all);
productRouter.post('/:id/rate', (0, express_validator_1.body)('rating').isFloat({ min: 0, max: 10 }), (0, express_validator_1.body)('comment').isString().optional(), controllers_1.ProductController.rateProduct);
productRouter.delete('/:id/rate', controllers_1.ProductController.deleteRating);
exports.default = productRouter;
//# sourceMappingURL=product.js.map