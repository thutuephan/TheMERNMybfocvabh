const express = require('express');
const path = require('path');
// import ApolloServer
const { ApolloServer} = require('apollo-server-express');
// import authMiddleWare function to be configured with the Apollo Server
const { authMiddleware } = require('./utils/auth');
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;
const server = new ApolloServer({
  typeDefs,
  resolvers,
  // add context to our server so data from authMiddleWare function can pass to our resolver functions
  // context: authMiddleware, => I have to comment this out because it gave the app an error in server while trying to run the playground, Jeremy-a BCS learning assistant explained that when I passed authMiddleware which is supposed to get a security token in order for the requests to work; GarphQl is not part of the app and is not ssigned in, so GQL playground is being denied because of the authMiddleware. That's why I got the error "server cannot be reached" and could not open schema in the playground
  // context: authMiddleware,
})

server.applyMiddleware({ app });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    // log where we can go to test our GQL API
    console.log(`Use GraphQl at http://localhost:${PORT}${server.graphqlPath}`);
  })
});
