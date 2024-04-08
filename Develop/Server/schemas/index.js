const { gql } = require('apollo-server-express');
const typeDefs = require('./typedefs');
const resolvers = require('./resolvers');

module.exports = {
  gql,
  typeDefs,
  resolvers
};
