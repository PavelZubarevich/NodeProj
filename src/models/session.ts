import { getModelForClass } from '@typegoose/typegoose';
import { SessionsClass } from '../types/mongoEntity';

export const MongoSession = getModelForClass(SessionsClass);
