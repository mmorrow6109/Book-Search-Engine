import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import './App.css';
import { Outlet } from 'react-router-dom';

import Navbar from './components/Navbar';

// Create the Apollo Client instance
const client = new ApolloClient({
  uri: '/graphql', // Specify the URI of your GraphQL endpoint
  cache: new InMemoryCache() // Initialize a new in-memory cache
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Navbar />
      <Outlet />
    </ApolloProvider>
  );
}

export default App;
