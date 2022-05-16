import { getModelForClass } from '@typegoose/typegoose';
import { SessionsClass } from '../types/types';

export const MongoSession = getModelForClass(SessionsClass);
