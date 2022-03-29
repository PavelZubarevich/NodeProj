import { getModelForClass } from '@typegoose/typegoose';
import { ProductClass } from '../types/types';

export const MongoProduct = getModelForClass(ProductClass);
