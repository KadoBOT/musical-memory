import ApolloClient, { createNetworkInterface } from 'apollo-client';
import {SubscriptionClient, addGraphQLSubscriptions} from 'subscriptions-transport-ws/dist/client';

const networkInterface = options => createNetworkInterface({
  uri: 'http://localhost:3001/graphql',
  ...options
});

export const browserClient = () => {
  const wsClient = new SubscriptionClient('ws://localhost:3001/subscriptions', {
    reconnect: true
  });

  const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
    networkInterface(),
    wsClient
  )

  return new ApolloClient({
    networkInterface: networkInterfaceWithSubscriptions
  })
}

export const serverClient = ctx => {
  const networkInterfaceWithOptions = networkInterface({
    opts: {
      credentials: 'same-origin',
      headers: {
        cookie: ctx.request.get('Cookie'),
      }
    },
    batchInterval: 20,
  })

  return new ApolloClient({
    networkInterface: networkInterfaceWithOptions,
    ssrMode: true
  })
}
