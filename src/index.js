import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo'

import Routes from './routes';
import registerServiceWorker from './registerServiceWorker';
import { browserClient } from '../server/apolloClient'

const client = browserClient()

ReactDOM.render((
  <ApolloProvider client={client}>
    <Router>
      <Routes />
    </Router>
  </ApolloProvider>
), document.getElementById('root'));
registerServiceWorker();
