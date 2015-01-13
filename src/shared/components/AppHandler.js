'use strict';

import React from 'react';
import { RouteHandler } from 'react-router';

import '../constants/PostConstants';
import '../actions/PostActions';
import '../stores/PostStore';

import '../constants/MenuConstants';
import '../actions/MenuActions';
import '../stores/MenuStore';

let App = React.createClass({
  render() {
    return (
      <div className="App">
        Hello, Parisleaf!
        <RouteHandler />
      </div>
    );
  }
});

export default App;
