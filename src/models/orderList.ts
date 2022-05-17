import { getModelForClass } from '@typegoose/typegoose';
import { OrderListClass } from '../types/mongoEntity';

export const MongoOrderList = getModelForClass(OrderListClass);
