import express from 'express';
import { productRouter } from './routes';
import { AppDataSource } from './db/postgresql';
import { connect } from './db/mongo';

const app = express();
const port = 3000;
const mongo = 'mongo';

const startServer = () => {
  app.listen(port, () => {
    console.log(`App listening on port ${port}, using ${process.env.DB} dataBase`);
  });
};

if (process.env.DB === mongo) {
  connect().then(() => {
    startServer();
  });
} else {
  AppDataSource.initialize().then(() => {
    startServer();
  });
}

app.use('/products', productRouter);
