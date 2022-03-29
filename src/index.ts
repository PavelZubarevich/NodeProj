import express from 'express';
import { productRouter } from './routes';
import { AppDataSource } from './db/postgresql';
import { connect } from './db/mongo';
import { APILogger, DBsLogger } from './logger';

const app = express();
const port = 3000;
const mongo = 'mongo';

const startServer = () => {
  app
    .listen(port, () => {
      APILogger.info('express');
      console.log(`App listening on port ${port}, using ${process.env.DB} dataBase`);
    })
    .on('error', (err) => {
      APILogger.error(err);
    });
};

if (process.env.DB === mongo) {
  connect()
    .then(() => {
      DBsLogger.info('connected');
      startServer();
    })
    .catch((err) => {
      DBsLogger.error(err);
    });
} else {
  AppDataSource.initialize()
    .then(() => {
      DBsLogger.info('connected');
      startServer();
    })
    .catch((err) => {
      DBsLogger.error(err);
    });
}

app.use('/products', productRouter);
