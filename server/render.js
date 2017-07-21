import { renderToString } from 'react-dom/server'
import React from 'react'
import { createApolloFetch } from 'apollo-fetch';
import ApolloClient, { ApolloProvider, renderToStringWithData } from 'react-apollo';
import path from 'path'
import fs from 'fs'
import { print } from 'graphql/language/printer';

const uri = 'http://localhost:3001/graphql'
const apolloFetch = createApolloFetch({ uri })
const networkInterface = {
  query: (req) => apolloFetch({ ...req, query: print(req.query) }),
};
const client = new ApolloClient({
  ssrMode: true,
  networkInterface
});


export default async (renderMe) => {
  const filePath = path.resolve(__dirname, '..', 'build', 'index.html')
  const markup = await renderToStringWithData(
    <ApolloProvider client={client}>
      {renderMe}
    </ApolloProvider>
  )

  return fs.readFileSync(filePath, 'utf8').replace('{{SSR}}', markup)
}
