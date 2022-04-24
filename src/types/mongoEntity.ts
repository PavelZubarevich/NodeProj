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

  @prop({ default: Date.now() })
  public createdAt?: Date;
}

@index({ totalRating: 1 })
@index({ price: 1 })
export class ProductClass {
  @prop({ unique: true })
  public displayName?: string;

  @prop({ ref: () => CategoryClass })
  public categoryId?: Ref<CategoryClass>[];

  @prop({ default: Date.now() })
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

export class OrderListClass {
  @prop({ ref: () => ProductClass })
  public products?: {
    product: Ref<ProductClass>[];
    quantity: number;
  };

  @prop({ ref: () => UserClass, required: true })
  public userId!: Ref<UserClass>;
}
