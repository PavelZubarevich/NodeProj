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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = require("./routes");
const postgresql_1 = require("./db/postgresql");
const mongo_1 = require("./db/mongo");
const logger_1 = require("./logger");
const express_graphql_1 = require("express-graphql");
const schema_1 = __importDefault(require("./graphQL/schema"));
const error_1 = require("./graphQL/error");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_json_1 = __importDefault(require("./swagger.json"));
const helpers_1 = require("./helpers");
const ws_1 = require("ws");
const controllers_1 = require("./controllers");
const repository_1 = require("./repository");
const node_cron_1 = __importDefault(require("node-cron"));
const task = node_cron_1.default.schedule('0 0 0 * * 1', () => {
    console.log('running a task every minute');
    controllers_1.ProductRatingsController.deleteRatings();
});
task.start();
const wss = new ws_1.WebSocketServer({ port: 8080 }, () => console.log('WS starter on port 8080'));
wss.on('connection', function connection(ws) {
    ws.on('message', function message(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const ratings = yield repository_1.ProductRatingsRepository.getLatestRatings();
            wss.clients.forEach((client) => {
                client.send(JSON.stringify(ratings));
            });
        });
    });
});
const app = (0, express_1.default)();
const port = 3000;
const mongo = 'mongo';
const developmentMode = process.env.NODE_ENV;
const startServer = () => {
    app.listen(port, () => {
        console.log(`App listening on port ${port}, using ${process.env.DB} dataBase`);
    });
};
try {
    if (process.env.DB === mongo) {
        (0, mongo_1.connect)().then(() => {
            startServer();
        });
    }
    else {
        postgresql_1.AppDataSource.initialize().then(() => {
            startServer();
        });
    }
}
catch (err) {
    developmentMode !== 'production' && logger_1.DBsLogger.error(err);
}
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(logger_1.APILogger);
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_json_1.default));
app.use('/products', routes_1.productRouter);
app.use('/categories', routes_1.categoryRouter);
app.use('/order-list', helpers_1.updateTokens, helpers_1.verifyUserMiddleware, routes_1.orderListRouter);
app.use('/admin', helpers_1.updateTokens, helpers_1.verifyAdminMiddleware, routes_1.adminRouter);
app.get('/lastRatings', controllers_1.ProductRatingsController.getLatestRatings);
app.use('/graphql', (0, express_graphql_1.graphqlHTTP)((req, res) => ({
    schema: schema_1.default,
    context: { req, res },
    customFormatErrorFn: (e) => {
        const error = error_1.errors[e.message];
        if (error) {
            return { message: error.message, statusCode: error.statusCode };
        }
        else {
            if (e.message.toLocaleLowerCase().includes('jwt')) {
                return { message: e.message, statusCode: 401 };
            }
            return { message: e.message, statusCode: 500 };
        }
    }
})));
app.use((err, req, res, next) => {
    if (err.name.toLocaleLowerCase().includes('token')) {
        err.statusCode = 401;
    }
    res.status(err.statusCode || 500).format({
        text: function () {
            res.send(err.stack);
        }
    });
});
//# sourceMappingURL=index.js.map