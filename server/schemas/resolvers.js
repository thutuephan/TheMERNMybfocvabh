const { User, Book } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        // By adding context to our query, we can retrieve the logged in user without specifically searching for them

        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id }).select('-__v -password') // this is syntax for versionkey (more info about this can be found in mongoose __v property -hide)
                return userData;
            }
            throw new AuthenticationError('You need to be logged in!');
        }
    },

    Mutation: {
        // Create user
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);
            return { token, user }
        },
        // login
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('No user with this email found!');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect password!');
            }

            const token = signToken(user);
            return { token, user };
        },

        // save book, add a third argument to the resolver to access data in our context (in this case is bookData)
        saveBook: async (parent, { bookData }, context) => {

            // if context has a `user` property, that means the user executing this mutation has a valid JWT and is logged in
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    {
                        // use push method to append the search put to book array
                        // should I replace this         { $addToSet: { savedBooks: body } }, ???

                        $push: { savedBooks: bookData }
                    },
                    {
                        new: true,
                        runValidation: true
                    },

                );
                return updatedUser;
            }
            // if user attempts to execute this mutation and isn't logged in, throw an error
            throw new AuthenticationError('You need to be logged in');
        },

        // remove book by id, accepts a book's bookId as a parameter; returns a User type.
        removeBook: async (parent, { bookId }, context) => {
            console.log(bookId);
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                
                    { _id: context.user._id },
                    // use $pull method to remove from an existing array all instances of a value that matches a specified condition, in this case it is bookId
                    { $pull: { savedBooks: {bookId} } },
                    { new: true }
                );
                return updatedUser;
            }
            throw new AuthenticationError('You need to be logged in!');

        },

    },
};

module.exports = resolvers;

// createUser,
//   getSingleUser,
//   saveBook,
//   deleteBook,
//   login,