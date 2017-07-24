import { createNetworkInterface, ApolloClient } from 'react-apollo';
import {SubscriptionClient, addGraphQLSubscriptions} from 'subscriptions-transport-ws/dist/client';

import WebSocket from 'ws';

const wsClient = new SubscriptionClient('ws://localhost:3000/subscriptions', {
  reconnect: true,
  connectionParams: {}
}, WebSocket);

const networkInterface = createNetworkInterface({
  uri: 'http://localhost:3001/graphql',
});

const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
  networkInterface,
  wsClient
);

const createClient = (opt = {}) => (
  new ApolloClient({
    networkInterface: networkInterfaceWithSubscriptions,
    ...opt
  })
)

export const browserClient = () => createClient({
  ssrForceFetchDelay: 100,
});

export const serverClient = () => createClient({
  ssrMode: true,
});
