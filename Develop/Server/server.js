const express = require('express');
const path = require('path');
const db = require('./config/connection');
const { ApolloServer } = require('apollo-server-express');
const { authMiddleware } = require('./utils/auth'); // Import your auth middleware
const typeDefs = require('./schemas/typedefs'); // Import your GraphQL type definitions
const resolvers = require('./schemas/resolvers'); // Import your GraphQL resolvers

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

async function startApolloServer() {
  const server = new ApolloServer({
    typeDefs, // Pass your GraphQL type definitions
    resolvers, // Pass your GraphQL resolvers
    context: authMiddleware, // Apply your authentication middleware to the context
  });

  await server.start();

  // Apply Apollo Server as middleware to Express app
  server.applyMiddleware({ app });
}

startApolloServer();

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on http://localhost:3001/`));
});
