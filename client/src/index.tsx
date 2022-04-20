import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: '/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      'x-user-id': token ? `${token}` : '',
    },
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundary>
      <Router>
        <ApolloProvider client={client}>
          <App />
        </ApolloProvider>
      </Router>
    </ErrorBoundary>
  </React.StrictMode>,
  document.getElementById('root')
);
