import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider, graphql } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import App from './app';

const client = new ApolloClient({
  link: new HttpLink(),
  cache: new InMemoryCache()
});

console.log(ApolloProvider);

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);