import { IUserRepository } from '../types/repository';
import { UserClass } from '../types/mongoEntity';
import { SQLUser } from '../entity';
import { MongoUser } from '../models';
import { AppDataSource } from '../db/postgresql';

const mongo = 'mongo';

class UserTypegooseRepository implements IUserRepository {
  async getUser(params: UserClass) {
    const user = await MongoUser.findOne(params).exec();
    return user;
  }

  async addUser(props: UserClass) {
    await MongoUser.create(props);
  }

  async updateOne(findParams: SQLUser, updateParams: UserClass) {
    await MongoUser.updateOne(findParams, { $set: updateParams });
  }
}

class UserTypeOrmRepository implements IUserRepository {
  async getUser(params: UserClass) {
    const user = await AppDataSource.manager.findOne(SQLUser, { where: params });
    return user;
  }

  async addUser(props: UserClass) {
    await AppDataSource.manager.insert(SQLUser, props);
  }

  async updateOne(findParams: SQLUser, updateParams: UserClass) {
    await AppDataSource.manager.update(SQLUser, findParams, updateParams);
  }
}

const UserRepository = process.env.DB === mongo ? new UserTypegooseRepository() : new UserTypeOrmRepository();

export default UserRepository;
