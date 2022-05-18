"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const repository_1 = require("../repository");
const express_validator_1 = require("express-validator");
const categoryRouter = (0, express_1.Router)();
categoryRouter.get('/', repository_1.CategoryRepository.all);
categoryRouter.get('/:id', (0, express_validator_1.query)('includeProducts')
    .custom((value) => {
    if (!(value === 'true' || value === 'false' || value === '')) {
        throw new Error('includeProducts should be boolean');
    }
    return true;
})
    .optional(), (0, express_validator_1.query)('includeTop3Products')
    .custom((value) => {
    if (!(value === 'true' || value === 'false' || value === '')) {
        throw new Error('includeTop3Products should be boolean');
    }
    return true;
})
    .optional(), repository_1.CategoryRepository.getCategory);
exports.default = categoryRouter;
//# sourceMappingURL=category.js.map