import { getModelForClass } from '@typegoose/typegoose';
import { OrderList } from '../types/mongoEntity';

export const MongoOrderList = getModelForClass(OrderList);
