"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIError = void 0;
class APIError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.name = 'APIError';
        this.statusCode = statusCode;
    }
}
exports.APIError = APIError;
//# sourceMappingURL=apiError.js.map