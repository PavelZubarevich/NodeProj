import { getModelForClass } from '@typegoose/typegoose';
import { ProductClass } from '../types/mongoEntity';

export const MongoProduct = getModelForClass(ProductClass);
