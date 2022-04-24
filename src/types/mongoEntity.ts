import { prop, index, Ref } from '@typegoose/typegoose';

export class SessionsClass {
  @prop({ require: true })
  public userName?: string;

  @prop({ required: true })
  public refreshToken?: string;
}

export class UserClass {
  @prop({ unique: true, require: true })
  public userName?: string;

  @prop({ required: true })
  public password?: string;

  @prop()
  public firstName?: string;

  @prop()
  public lastName?: string;

  @prop({ default: 'buyer' })
  public role?: string;
}

export class CategoryClass {
  @prop()
  public displayName?: string;

  @prop()
  public createdAt?: Date;
}

@index({ totalRating: 1 })
@index({ price: 1 })
export class ProductClass {
  @prop({ unique: true })
  public displayName?: string;

  @prop({ ref: () => CategoryClass })
  public categoryId?: Ref<CategoryClass>[];

  @prop()
  public createdAt?: Date;

  @prop()
  public totalRating?: Number;

  @prop()
  public price?: Number;

  @prop()
  public ratings?: {
    userId: string;
    rating: number;
  }[];
}
