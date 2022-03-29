import { createLogger, transports } from 'winston';

const APILogger = createLogger({
  transports: [new transports.Console(), new transports.File({ filename: 'logs/API.log' })]
});
const DBsLogger = createLogger({
  transports: [new transports.Console(), new transports.File({ filename: 'logs/DBs.log' })]
});

export { APILogger, DBsLogger };
