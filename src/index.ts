import express, { Response, Request, NextFunction } from 'express';
import { productRouter, categoryRouter } from './routes';
import { AppDataSource } from './db/postgresql';
import { connect } from './db/mongo';
import { APILogger, DBsLogger } from './logger';
import { APIError } from './error/apiError';
import { graphqlHTTP } from 'express-graphql';
import schema from './graphQL/schema';
import { errors } from './graphQL/error';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';

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
  developmentMode !== 'production' && DBsLogger.error(err);
}

app.use(express.json());
app.use(cookieParser());
app.use(APILogger);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/products', productRouter);
app.use('/categories', categoryRouter);
app.use(
  '/graphql',
  graphqlHTTP((req, res) => ({
    schema: schema,
    context: { req, res },
    customFormatErrorFn: (e) => {
      const error = errors[e.message];

      if (error) {
        return { message: error.message, statusCode: error.statusCode };
      } else {
        if (e.message.toLocaleLowerCase().includes('jwt')) {
          return { message: e.message, statusCode: 401 };
        }
        return { message: e.message, statusCode: 500 };
      }
    }
  }))
);

app.use((err: APIError, req: Request, res: Response, next: NextFunction) => {
  if (err.name.toLocaleLowerCase().includes('token')) {
    err.statusCode = 401;
  }

  res.status(err.statusCode || 500).format({
    text: function () {
      res.send(err.stack);
    }
  });
});
