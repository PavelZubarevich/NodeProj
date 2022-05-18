import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

export const mongoInit = async () => {
  const mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  return [mongo, uri];
};

export const dbConnect = async (uri) => {
  await mongoose.connect(uri);
};

export const dbDisconnect = async (mongo) => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongo.stop();
};
