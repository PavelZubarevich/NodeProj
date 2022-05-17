const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const mongoInit = async () => {
  const mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  return [mongo, uri];
};

const dbConnect = async (uri) => {
  await mongoose.connect(uri);
};

const dbDisconnect = async (mongo) => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongo.stop();
};

module.exports = {
  mongoInit,
  dbConnect,
  dbDisconnect
};
