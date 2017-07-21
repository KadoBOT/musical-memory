import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import ApolloClient, { ApolloProvider } from 'react-apollo'
import { createApolloFetch } from 'apollo-fetch';
import { print } from 'graphql/language/printer';
import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws';

import './index.css';
import Routes from './routes';
import registerServiceWorker from './registerServiceWorker';


const uri = '/graphql'
const apolloFetch = createApolloFetch({ uri })
const wsClient = new SubscriptionClient('ws://localhost:3001/subscriptions', {
  reconnect: true,
});
const networkInterface = {
  query: req => apolloFetch({ ...req, query: print(req.query) })
}
const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
  networkInterface,
  wsClient,
);

const client = new ApolloClient({
  networkInterface: networkInterfaceWithSubscriptions
})

ReactDOM.render((
  <ApolloProvider client={client}>
    <Router>
      <Routes />
    </Router>
  </ApolloProvider>
), document.getElementById('root'));
registerServiceWorker();
