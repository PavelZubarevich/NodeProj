import express from 'express';
import { productRouter } from './routes';
import { AppDataSource } from './db/postgresql';
import { connect } from './db/mongo';
import { APILogger, DBsLogger } from './logger';

const app = express();
const port = 3000;
const mongo = 'mongo';
const developmentMode = process.env.NODE_ENV;

const startServer = () => {
  app.listen(port, () => {
    console.log(`App listening on port ${port}, using ${process.env.DB} dataBase`);
  });
};

try {
  if (process.env.DB === mongo) {
    connect().then(() => {
      startServer();
    });
  } else {
    AppDataSource.initialize().then(() => {
      startServer();
    });
  }
} catch (err) {
  developmentMode === 'production' && DBsLogger.error(err);
}

app.use(APILogger);
app.use('/products', productRouter);
