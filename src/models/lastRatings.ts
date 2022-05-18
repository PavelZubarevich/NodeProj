import { getModelForClass } from '@typegoose/typegoose';
import { LastRating } from '../types/mongoEntity';

export const MongoLastRatings = getModelForClass(LastRating);
