import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLInt,
  GraphQLInputObjectType
} from 'graphql';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_ACCESS_SECTER_KEY, JWT_REFRESH_SECTER_KEY } from '../../config';
import {
  UserRepository,
  ProductRepository,
  SessionRepository,
  OrderProductRepository,
  OrderListRepository
} from '../../repository';
import { APIError } from '../../error/apiError';
import 'reflect-metadata';

const generateTokens = (userId: string, userRole: string | undefined) => {
  const accessToken = jwt.sign({ userId, userRole }, JWT_ACCESS_SECTER_KEY, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ userId, userRole }, JWT_REFRESH_SECTER_KEY, { expiresIn: '50d' });
  return {
    accessToken,
    refreshToken
  };
};

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    _id: { type: GraphQLID },
    userName: { type: GraphQLString },
    password: { type: GraphQLString }
  })
});

const ProductType = new GraphQLInputObjectType({
  name: 'Product',
  fields: () => ({
    productId: { type: GraphQLString },
    quantity: { type: GraphQLInt }
  })
});

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    getUsers: {
      type: new GraphQLList(UserType),
      resolve(parent, args) {
        return 'users';
      }
    }
  }
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    register: {
      type: GraphQLString,
      args: {
        userName: { type: GraphQLString },
        password: { type: GraphQLString },
        firstName: { type: GraphQLString, defaultValue: null },
        lastName: { type: GraphQLString, defaultValue: null }
      },
      async resolve(parent, { userName, password, firstName, lastName }, { req, res }) {
        const user = await UserRepository.getUser({ userName });
        if (user) {
          res.status(403);
          throw new Error('USER_ALREADY_EXISTS');
        }

        const hashedPass = await bcrypt.hash(password, 10);

        await UserRepository.addUser({ userName, password: hashedPass, firstName, lastName });
        return `User ${userName} added`;
      }
    },
    authenticate: {
      type: GraphQLString,
      args: {
        userName: { type: GraphQLString },
        password: { type: GraphQLString }
      },
      async resolve(parent, { userName, password }, { req, res }) {
        const user = await UserRepository.getUser({ userName });

        if (!user) {
          res.status(401);
          throw new Error('USER_NOT_FOUND');
        }

        const isValidPassword = await bcrypt.compare(password, user.password || '');

        if (isValidPassword) {
          const { accessToken, refreshToken } = generateTokens(user._id, user.role);
          res.cookie('RefreshToken', refreshToken, { httpOnly: true });
          const sessionsForUser = await SessionRepository.getCountByField({ userName });
          if (sessionsForUser >= 5) {
            await SessionRepository.findOneAndDelete({ userName }, { id: -1 });
          }
          await SessionRepository.addSession({ userName, refreshToken });
          return accessToken;
        } else {
          res.status(401);
          throw new Error('INCORRECT_PASSWORD');
        }
      }
    },
    token: {
      type: GraphQLString,
      async resolve(parent, args, { req, res }) {
        const cookieTocken = req.headers.cookie.split('=')[1];
        const session = await SessionRepository.getSession({ refreshToken: cookieTocken });

        if (session) {
          const user = await UserRepository.getUser({ userName: session.userName });
          if (user) {
            const { accessToken, refreshToken } = generateTokens(user._id, user.role);
            res.cookie('RefreshToken', refreshToken, { httpOnly: true });
            SessionRepository.updateOne({ refreshToken: cookieTocken }, { refreshToken });
            return accessToken;
          }
        }
        return 'reject';
      }
    },
    profile: {
      type: GraphQLString,
      args: {
        accessToken: { type: GraphQLString },
        firstName: { type: GraphQLString, defaultValue: null },
        lastName: { type: GraphQLString, defaultValue: null }
      },
      async resolve(parent, { accessToken, firstName, lastName }, { res }) {
        try {
          const jwtData = jwt.verify(accessToken, JWT_ACCESS_SECTER_KEY);

          if (jwtData) {
            const newData: { firstName?: string; lastName?: string } = {};

            firstName && (newData.firstName = firstName);
            lastName && (newData.lastName = lastName);

            await UserRepository.updateOne({ _id: (<any>jwtData).userId }, newData);
            return JSON.stringify(newData);
          }
        } catch (e: any) {
          res.status(400);
          throw new Error(e);
        }
      }
    },
    profilePassword: {
      type: GraphQLString,
      args: {
        accessToken: { type: GraphQLString },
        password: { type: GraphQLString }
      },
      async resolve(parent, { accessToken, password }, { res }) {
        try {
          const jwtData = jwt.verify(accessToken, JWT_ACCESS_SECTER_KEY);

          if (jwtData) {
            const hashedPass = await bcrypt.hash(password, 10);
            await UserRepository.updateOne({ _id: (<any>jwtData).userId }, { password: hashedPass });
            return 'Password successfully changed';
          }
        } catch (e: any) {
          res.status(400);
          throw new Error(e.message);
        }
      }
    },
    rateProduct: {
      type: GraphQLString,
      args: {
        accessToken: { type: GraphQLString },
        productId: { type: GraphQLString },
        rating: { type: GraphQLInt }
      },
      async resolve(parent, { accessToken, productId, rating }, { res }) {
        try {
          if (!(rating >= 0 && rating <= 10)) {
            throw new APIError(400, 'INVALID_PARAMS');
          }
          const user = jwt.verify(accessToken, JWT_ACCESS_SECTER_KEY);

          if ((<any>user).userRole === 'buyer') {
            const ratedProduct = await ProductRepository.getProductById(productId);

            const ratings = [];

            if (ratedProduct) {
              const applyedRatings = ratedProduct.ratings || [];
              ratings.push(...applyedRatings);
              let isRated: boolean = false;
              ratings.map((ratingObj) => {
                if (ratingObj.userId === (<any>user).userId) {
                  isRated = true;
                  return (ratingObj.rating = rating);
                }
                return rating;
              });
              if (!isRated) {
                ratings.push({ userId: (<any>user).userId, rating: rating, createdAt: new Date() });
              }
            } else {
              throw new APIError(404, 'PRODUCT_NOT_FOUND');
            }

            const newProduct = await ProductRepository.updateRatings(productId, (<any>user).userId, <any>ratings);

            ProductRepository.updateTotalRating(productId);
            return JSON.stringify(newProduct);
          }
        } catch (e: any) {
          if (e.statusCode) {
            res.status(e.statusCode);
          }
          throw new Error(e.message);
        }
      }
    },
    unrateProduct: {
      type: GraphQLString,
      args: {
        accessToken: { type: GraphQLString },
        productId: { type: GraphQLString }
      },
      async resolve(parent, { accessToken, productId }, { res }) {
        try {
          const user = jwt.verify(accessToken, JWT_ACCESS_SECTER_KEY);

          if ((<any>user).userRole === 'buyer') {
            await ProductRepository.deleteRating(productId, (<any>user).userId);
            return 'success';
          }
        } catch (e: any) {
          if (e.statusCode) {
            res.status(e.statusCode);
          }
          throw new Error(e.message);
        }
      }
    },

    addProductsToOrder: {
      type: GraphQLString,
      args: {
        accessToken: { type: GraphQLString },
        products: { type: new GraphQLList(ProductType) }
      },
      async resolve(parent, { accessToken, products }, { res }) {
        try {
          let response;

          const user = jwt.verify(accessToken, JWT_ACCESS_SECTER_KEY);

          const order = await OrderListRepository.getOrderByUserId((<any>user).userId);

          if (order) {
            const productIds = [];

            for (const product of products) {
              const dbProduct = await OrderProductRepository.updateOrInsertProduct(
                { productId: product.productId, orderListId: order._id },
                { quantity: product.quantity }
              );
              productIds.push(dbProduct._id);
            }
            response = await OrderListRepository.updateOrderProducts(order, productIds);
          } else {
            const order = await OrderListRepository.createOrder((<any>user).userId);
            if (order) {
              const productsPayload = products.map((product: any) => {
                product.orderListId = order._id;
                return product;
              });

              const dbProducts = await OrderProductRepository.addProducts(productsPayload);

              const productIds = dbProducts.map((product) => {
                return product._id;
              });

              response = await OrderListRepository.updateOrderProducts(order, productIds);
            }
          }
          return JSON.stringify(response);
        } catch (e: any) {
          if (e.statusCode) {
            res.status(e.statusCode);
          }
          throw new Error(e.message);
        }
      }
    },

    removeOrder: {
      type: GraphQLString,
      args: {
        accessToken: { type: GraphQLString }
      },
      async resolve(parent, { accessToken, productId }, { res }) {
        try {
          const user = jwt.verify(accessToken, JWT_ACCESS_SECTER_KEY);

          const order = await OrderListRepository.getOrderByUserId((<any>user).userId);

          if (order) {
            await OrderProductRepository.deleteAllProducts(order);
            await OrderListRepository.deleteOrderById(order._id);
          } else {
            throw new APIError(404, 'Order List does not exist');
          }
        } catch (e: any) {
          if (e.statusCode) {
            res.status(e.statusCode);
          }
          throw new Error(e.message);
        }
      }
    },
    updateProductsInOrder: {
      type: GraphQLString,
      args: {
        accessToken: { type: GraphQLString },
        products: { type: new GraphQLList(ProductType) }
      },
      async resolve(parent, { accessToken, products }, { res }) {
        try {
          const user = jwt.verify(accessToken, JWT_ACCESS_SECTER_KEY);

          let response;

          const order = await OrderListRepository.getOrderByUserId((<any>user).userId);

          if (order) {
            response = await OrderProductRepository.updateProducts(order, products);
          } else {
            throw new APIError(404, 'Order does not exists');
          }

          return JSON.stringify(response);
        } catch (e: any) {
          if (e.statusCode) {
            res.status(e.statusCode);
          }
          throw new Error(e.message);
        }
      }
    }
  }
});

export default new GraphQLSchema({
  query: Query,
  mutation: Mutation
});
