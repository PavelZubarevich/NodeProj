import { getModelForClass } from '@typegoose/typegoose';
import { OrderProduct } from '../types/mongoEntity';

export const MongoOrderProduct = getModelForClass(OrderProduct);
