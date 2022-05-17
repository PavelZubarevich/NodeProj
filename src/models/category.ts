import { getModelForClass } from '@typegoose/typegoose';
import { CategoryClass } from '../types/mongoEntity';

export const MongoCategory = getModelForClass(CategoryClass);
