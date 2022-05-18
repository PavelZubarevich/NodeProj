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
const entity_1 = require("../entity");
const models_1 = require("../models");
const postgresql_1 = require("../db/postgresql");
const mongo = 'mongo';
class UserTypegooseRepository {
    getUser(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield models_1.MongoUser.findOne(params).exec();
            return user;
        });
    }
    getUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield models_1.MongoUser.findById(userId);
            return user;
        });
    }
    addUser(props) {
        return __awaiter(this, void 0, void 0, function* () {
            yield models_1.MongoUser.create(props);
        });
    }
    updateOne(findParams, updateParams) {
        return __awaiter(this, void 0, void 0, function* () {
            yield models_1.MongoUser.updateOne(findParams, { $set: updateParams });
        });
    }
}
class UserTypeOrmRepository {
    getUser(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield postgresql_1.AppDataSource.manager.findOne(entity_1.SQLUser, { where: params });
            return user;
        });
    }
    getUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield postgresql_1.AppDataSource.manager.findOneBy(entity_1.SQLUser, { _id: +userId });
            return user;
        });
    }
    addUser(props) {
        return __awaiter(this, void 0, void 0, function* () {
            yield postgresql_1.AppDataSource.manager.insert(entity_1.SQLUser, props);
        });
    }
    updateOne(findParams, updateParams) {
        return __awaiter(this, void 0, void 0, function* () {
            yield postgresql_1.AppDataSource.manager.update(entity_1.SQLUser, findParams, updateParams);
        });
    }
}
const UserRepository = process.env.DB === mongo ? new UserTypegooseRepository() : new UserTypeOrmRepository();
exports.default = UserRepository;
//# sourceMappingURL=userRepository.js.map