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

app.use(cookieParser());
app.use(APILogger);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/products', productRouter);
app.use('/categories', categoryRouter);
app.use(
  '/graphql',
  graphqlHTTP((req, res) => ({
    schema: schema,
    // rootValue: root,
    // graphiql: true,
    context: { req, res },
    customFormatErrorFn: (e) => {
      const error = errors[e.message];

      if (error) {
        return { message: error.message, statusCode: error.statusCode };
      } else {
        return e;
      }
    }
  }))
);

app.use((err: APIError, req: Request, res: Response, next: NextFunction) => {
  res.status(err.statusCode || 500).format({
    text: function () {
      res.send(err.stack);
    }
  });
});
