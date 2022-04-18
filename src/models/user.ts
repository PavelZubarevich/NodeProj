import { getModelForClass } from '@typegoose/typegoose';
import { UserClass } from '../types/types';

export const MongoUser = getModelForClass(UserClass);
