import { MongoSession } from '../models';
import { SQLSession } from '../entity';
import { ISortProps, ISQLSortProps } from '../types/types';
import { SessionsClass } from '../types/mongoEntity';
import { ISessionRepository } from '../types/repository';
import { AppDataSource } from '../db/postgresql';

const mongo = 'mongo';

class SessionTypegooseRepository implements ISessionRepository {
  async addSession(data: SessionsClass) {
    await MongoSession.create(data);
  }

  async getSession(params: SessionsClass) {
    const user = await MongoSession.findOne(params).exec();
    return user;
  }

  async getCountByField(params: SessionsClass) {
    const sessionsForUser = await MongoSession.countDocuments(params);
    return sessionsForUser;
  }

  async findOneAndDelete(params: SessionsClass, sorting: ISortProps | ISQLSortProps) {
    await MongoSession.findOneAndDelete(params, { sort: sorting });
  }

  async updateOne(findParams: SessionsClass, updateParams: SessionsClass) {
    await MongoSession.updateOne(findParams, { $set: updateParams });
  }
}

class SessionTypeOrmRepository implements ISessionRepository {
  async addSession(data: SessionsClass) {
    await AppDataSource.manager.insert(SQLSession, data);
  }

  async getSession(params: SessionsClass) {
    const user = await AppDataSource.manager.findOne(SQLSession, { where: params });
    return user;
  }

  async getCountByField(params: SessionsClass) {
    const sessionsForUser = await AppDataSource.manager.count(SQLSession, {});
    return sessionsForUser;
  }

  async findOneAndDelete(params: SessionsClass) {
    const session = await AppDataSource.manager.findOne(SQLSession, { where: params });
    await AppDataSource.manager.delete(SQLSession, { id: session?.id });
  }

  async updateOne(findParams: SessionsClass, updateParams: SessionsClass) {
    await AppDataSource.manager.update(SQLSession, findParams, updateParams);
  }
}

const SessionRepository = process.env.DB === mongo ? new SessionTypegooseRepository() : new SessionTypeOrmRepository();

export default SessionRepository;
