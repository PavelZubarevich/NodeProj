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
class SessionTypegooseRepository {
    addSession(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield models_1.MongoSession.create(data);
        });
    }
    getSession(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield models_1.MongoSession.findOne(params).exec();
            return user;
        });
    }
    getCountByField(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const sessionsForUser = yield models_1.MongoSession.countDocuments(params);
            return sessionsForUser;
        });
    }
    findOneAndDelete(params, sorting) {
        return __awaiter(this, void 0, void 0, function* () {
            yield models_1.MongoSession.findOneAndDelete(params, { sort: sorting });
        });
    }
    updateOne(findParams, updateParams) {
        return __awaiter(this, void 0, void 0, function* () {
            yield models_1.MongoSession.updateOne(findParams, { $set: updateParams });
        });
    }
}
class SessionTypeOrmRepository {
    addSession(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield postgresql_1.AppDataSource.manager.insert(entity_1.SQLSession, data);
        });
    }
    getSession(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield postgresql_1.AppDataSource.manager.findOne(entity_1.SQLSession, { where: params });
            return user;
        });
    }
    getCountByField(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const sessionsForUser = yield postgresql_1.AppDataSource.manager.count(entity_1.SQLSession, {});
            return sessionsForUser;
        });
    }
    findOneAndDelete(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield postgresql_1.AppDataSource.manager.findOne(entity_1.SQLSession, { where: params });
            yield postgresql_1.AppDataSource.manager.delete(entity_1.SQLSession, { id: session === null || session === void 0 ? void 0 : session.id });
        });
    }
    updateOne(findParams, updateParams) {
        return __awaiter(this, void 0, void 0, function* () {
            yield postgresql_1.AppDataSource.manager.update(entity_1.SQLSession, findParams, updateParams);
        });
    }
}
const SessionRepository = process.env.DB === mongo ? new SessionTypegooseRepository() : new SessionTypeOrmRepository();
exports.default = SessionRepository;
//# sourceMappingURL=sessionRepository.js.map