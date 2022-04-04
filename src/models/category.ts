import { getModelForClass } from '@typegoose/typegoose';
import { CategoryClass } from '../types/types';

export const Category = getModelForClass(CategoryClass);
