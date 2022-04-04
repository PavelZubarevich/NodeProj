import mongoose from 'mongoose';
import express from 'express';
import { productRouter } from './routes';

const url = 'mongodb://localhost:27017/testProducts';
const app = express();
const port = 3000;

const startServer = () => {
  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
};

const conectDB = async () => {
  try {
    await mongoose.connect(url);
    startServer();
  } catch (e) {
    console.log(e);
  }
};

conectDB();

app.use('/products', productRouter);
