const { User, Book } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        user: async () => {
            return User.find();
        }
    },

    Mutation: {
        createUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);
            return { token, user }
        },

        

    }
}


createUser,
  getSingleUser,
  saveBook,
  deleteBook,
  login,