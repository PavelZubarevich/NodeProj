"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const entity_1 = require("../entity");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    url: process.env.DB_CONN_STRING,
    synchronize: true,
    logging: false,
    entities: [entity_1.SQLProduct, entity_1.SQLCategory, entity_1.SQLSession, entity_1.SQLUser, entity_1.SQLUserRating, entity_1.SQLOrderList, entity_1.SQLOrderProduct, entity_1.SQLLastRating],
    migrations: [],
    subscribers: []
});
//# sourceMappingURL=postgresql.js.map