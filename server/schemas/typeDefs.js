const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
      _id: ID!,
      username: String!,
      email: String!,
      # user will save books to their account, referred to User.js
      bookCount: Int,
      savedBooks: [Book]

  }

  type Book {
    authors: [String]
    description: String!,
    bookId: String!,
    image: String,
    link: String,
    title: String!

  }
  input BookInput {
    authors: [String]
    description: String!,
    bookId: String!,
    image: String,
    link: String,
    title: String!

  }
  type Auth {
    token: ID!
    user: User
  }

  type Query {
      me: User

  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(bookData: BookInput!): User
    removeBook(bookId: String!): User
  }
`;

module.exports = typeDefs;