const { User, Book } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        user: async () => {
            return User.findOne({});
        }
    }

    Mutation: {

    }
}


createUser,
  getSingleUser,
  saveBook,
  deleteBook,
  login,