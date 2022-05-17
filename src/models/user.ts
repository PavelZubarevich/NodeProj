import { getModelForClass } from '@typegoose/typegoose';
import { UserClass } from '../types/mongoEntity';

export const MongoUser = getModelForClass(UserClass);
