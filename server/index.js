import 'isomorphic-fetch';

import koa from 'koa';
import morgan from 'koa-morgan';
import favicon from 'koa-favicon'
import rt from 'koa-rt'
import compress from 'koa-compress'
import htmlMinifier from "koa-html-minifier";
import staticCache from 'koa-static-cache'
import bodyParser from 'koa-bodyparser'
import Router from 'koa-router'
import logger from 'koa-logger'
import cors from 'koa-cors'
import React from 'react';
import { StaticRouter, matchPath } from 'react-router-dom';
// import OpticsAgent from 'optics-agent';
// import * as graphql from 'graphql'
import { execute, subscribe } from 'graphql';
import { createServer } from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { graphqlKoa, graphiqlKoa } from 'graphql-server-koa';
import path from 'path';
import { ApolloProvider } from 'react-apollo';
// import  { createLocalInterface }  from 'apollo-local-query'
import { PubSub } from 'graphql-subscriptions';

import dynamo from './dynamodb'
import schema from './schema'
import config from './config'
import render from './render'
import Routes from '../src/routes'
import { serverClient } from '../src/config/apolloClient'

const PORT = 3001
const router = new Router();
const app = new koa();
// const agent = new OpticsAgent.Agent({ apiKey: 'service:KadoBOT-Dynamo:mngP6ONbva10168i-1T36g' })
const routes = ['/', '/example', '/example2']

const start = async () => {
  try {
    const options = {
      context: dynamo,
      schema: schema
    }

    const pubsub = new PubSub();
    const ws = createServer(app.callback())

    app.use(cors({
    	origin: '*'
    }))
    app.use(favicon());
    app.use(rt());
    app.use(compress());
    app.use(htmlMinifier({
      collapseWhitespace: true,
      removeComments: true,
      preserveLineBreaks: false,
      removeEmptyAttributes: false,
      removeIgnored: true
    }))

    app.use(bodyParser());

    if (config.debug && process.env.NODE_ENV !== 'test') {
      app.use(logger());
    }

    app.use(morgan('combined'))

    router.use('/static', staticCache(path.join(__dirname, '..', 'build'), {
      gzip: true,
      buffer: !config.debug,
      maxAge: config.debug ? 0 : 60 * 60 * 24 * 7
    }));

    router.get(/^(?!\/graphiql).*$/, async (ctx) => {
      const { url } = ctx.request
      const match = routes.reduce((acc, route) => matchPath(url, route, { exact: true }) || acc, null);
      const context = {}
      if (!match) {
        ctx.status = 404
        ctx.body = render(<div>Not Found</div>)
      }

      if (context.url) {
        ctx.redirect(301, context.url)
      }

      const client = serverClient(ctx)

      const item = await render(
        <ApolloProvider client={client}>
          <StaticRouter context={context} location={url}>
            <Routes />
          </StaticRouter>
        </ApolloProvider>
      )
      ctx.status = 200
      ctx.body = item

    })
    router.post('/graphql', graphqlKoa(options));
    router.get('/graphiql', graphiqlKoa({
      endpointURL: '/graphql',
      subscriptionsEndpoint: 'ws://localhost:3001/subscriptions'
    }))


    app.use(router.routes());
    app.use(router.allowedMethods())

    ws.listen(PORT, () => {
      console.log(`🖥️  GraphQL Koa server running on port ${PORT}`);

      // Set up the WebSocket for handling GraphQL subscriptions
      new SubscriptionServer({
        execute,
        subscribe,
        schema,
        onConnect: (connectionParams, webSocket) => {
          console.log('💩', connectionParams, webSocket)
        },
      }, {
        server: ws,
        path: '/subscriptions',
      });
    });

  } catch (err) {
    console.error(err)
  }
}

start()
