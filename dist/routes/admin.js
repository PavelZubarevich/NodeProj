"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const express_validator_1 = require("express-validator");
const helpers_1 = require("../helpers");
const adminRouter = (0, express_1.Router)();
adminRouter.get('/products/:id', controllers_1.ProductController.getProductById);
adminRouter.post('/products', (0, express_validator_1.body)('displayName').isString(), (0, express_validator_1.body)('price').isFloat({ min: 0 }), (0, express_validator_1.body)('categoryId').isArray().optional(), helpers_1.validateQueryDataMiddleware, controllers_1.ProductController.addProduct);
adminRouter.patch('/products/:id', (0, express_validator_1.body)('displayName').isString(), (0, express_validator_1.body)('price').isFloat({ min: 0 }), (0, express_validator_1.body)('categoryId').isArray().optional(), helpers_1.validateQueryDataMiddleware, controllers_1.ProductController.updateProduct);
adminRouter.delete('/products/:id', controllers_1.ProductController.deleteProduct);
adminRouter.post('/categories', (0, express_validator_1.body)('displayName').isString(), helpers_1.validateQueryDataMiddleware, controllers_1.CategoryController.addCategory);
adminRouter.patch('/categories/:id', (0, express_validator_1.body)('displayName').isString(), helpers_1.validateQueryDataMiddleware, controllers_1.CategoryController.updateCategory);
adminRouter.delete('/categories/:id', controllers_1.CategoryController.deleteCategory);
exports.default = adminRouter;
//# sourceMappingURL=admin.js.map