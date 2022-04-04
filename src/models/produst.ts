import { getModelForClass } from '@typegoose/typegoose';
import { ProductClass } from '../types/types';

export const Product = getModelForClass(ProductClass);
