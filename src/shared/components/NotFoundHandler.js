'use strict';

import React from 'react';
import Header from './Header';
import Button from './Button';
import AppLink from './AppLink';
import PageHeader from './PageHeader';

let NotFoundHandler = React.createClass({

  render() {
    return (
      <div className="NotFound">
        <style>{`
          #logo {
            transform: rotateZ(180deg);
          }
        `}</style>
        <div className="NotFound-header">
          <PageHeader
            subtitle="That page totally doesn't exist!"
            title="Well, this is awkward."
          />
        </div>
        <div className="NotFound-content">
          <Header level={1}>Error 404!</Header>
          <Header level={4}>There might still be hope:</Header>
          <Button component={AppLink} to='/home' primaryDark>
            Get me outta here
          </Button>
        </div>
      </div>
    );
  },
});


export default NotFoundHandler;
