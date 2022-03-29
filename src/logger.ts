import { createLogger, transports } from 'winston';
import expressWinston from 'express-winston';

const APILogger = expressWinston.logger({
  transports: [new transports.File({ filename: 'logs/API.log' })]
});

const DBsLogger = createLogger({
  transports: [new transports.File({ filename: 'logs/DBs.log' })]
});

export { APILogger, DBsLogger };
