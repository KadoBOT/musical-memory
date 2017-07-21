/* eslint no-restricted-properties: 0 */

import React from 'react';
import { Link, Route, Switch } from 'react-router-dom';

import Posts from './components/Posts'
import CreatePost from './components/Posts/CreatePost'
import Example2 from './components/Example2'

export default () => (
  <div>
    <Link to="/">Home</Link>
    <Link to="/create-post">Create a Post</Link>

    <Switch>
      <Route path="/" exact component={Posts} />
      <Route path="/create-post" component={CreatePost} />
      <Route component={Example2} />
    </Switch>
  </div>
)
