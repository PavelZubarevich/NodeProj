import mongoose from 'mongoose';

export const connect = async () => {
  await mongoose.connect(process.env.DB_CONN_STRING || '');
};
