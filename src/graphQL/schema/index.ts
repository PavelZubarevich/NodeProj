import { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema, GraphQLList } from 'graphql';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_ACCESS_SECTER_KEY, JWT_REFRESH_SECTER_KEY } from '../../config';
import { UserRepository } from '../../repository';
import SessionRepository from '../../repository/sessionRepository';
import { MongoSession } from '../../models';

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
          const { accessToken, refreshToken } = generateTokens(user.id);
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
            const { accessToken, refreshToken } = generateTokens(user.id);
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

            await UserRepository.updateOne({ id: (<any>jwtData).userId }, newData);
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
            await UserRepository.updateOne({ id: (<any>jwtData).userId }, { password: hashedPass });
            return 'Password successfully changed';
          }
        } catch (e: any) {
          res.status(400);
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
