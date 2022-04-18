import { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema, GraphQLList } from 'graphql';
import { MongoUser, MongoSession } from '../../models';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_ACCESS_SECTER_KEY, JWT_REFRESH_SECTER_KEY } from '../../config';

const generateTokens = (userId: any) => {
  const accessToken = jwt.sign({ userId }, JWT_ACCESS_SECTER_KEY, { expiresIn: '5m' });
  const refreshToken = jwt.sign({ userId }, JWT_REFRESH_SECTER_KEY, { expiresIn: '50d' });
  return {
    accessToken,
    refreshToken
  };
};

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    userName: { type: GraphQLString },
    password: { type: GraphQLString }
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
        const user = await MongoUser.findOne({ userName }).exec();
        if (user) {
          res.status(403);
          throw new Error('USER_ALREADY_EXISTS');
        }

        const hashedPass = await bcrypt.hash(password, 10);

        await MongoUser.create({ userName, password: hashedPass, firstName, lastName });
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
        const user = await MongoUser.findOne({ userName }).exec();

        if (!user) {
          res.status(401);
          throw new Error('USER_NOT_FOUND');
        }

        const isValidPassword = await bcrypt.compare(password, user.password || '');

        if (isValidPassword) {
          const { accessToken, refreshToken } = generateTokens(user._id);
          res.cookie('RefreshToken', refreshToken, { httpOnly: true });
          const sessionsForUser = await MongoSession.countDocuments({ userName });
          if (sessionsForUser >= 5) {
            await MongoSession.findOneAndDelete({ userName }, { sort: { _id: -1 } });
          }

          await MongoSession.create({ userName, refreshToken });
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
        const session = MongoSession.findOne({ refreshToken: cookieTocken }).exec();
        console.log(123, session);
        // if (session) {
        // const { accessToken, refreshToken } = generateTokens(user._id);
        // }

        return session;
      }
    }
  }
});

export default new GraphQLSchema({
  query: Query,
  mutation: Mutation
});
