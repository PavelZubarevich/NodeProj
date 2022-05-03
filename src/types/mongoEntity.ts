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
  @prop({ unique: true, required: true })
  public displayName!: string;

  @prop({ ref: () => CategoryClass })
  public categoryId?: Ref<CategoryClass>[];

  @prop({ default: Date.now() })
  public createdAt?: Date;

  @prop()
  public totalRating?: Number;

  @prop({ required: true })
  public price!: Number;

  @prop()
  public ratings?: {
    userId: string;
    rating: number;
    createdAt: Date;
  }[];
}

export class OrderListClass {
  @prop({ ref: () => OrderProduct })
  // eslint-disable-next-line
  public products?: Ref<OrderProduct>[];

  @prop({ ref: () => UserClass, required: true, unique: true })
  public userId!: Ref<UserClass>;
}

export class OrderProduct {
  @prop({ ref: () => ProductClass, required: true })
  productId!: Ref<ProductClass>;

  @prop({ ref: () => OrderListClass, required: true })
  orderListId!: Ref<OrderListClass>;

  @prop({ required: true })
  quantity!: number;
}
