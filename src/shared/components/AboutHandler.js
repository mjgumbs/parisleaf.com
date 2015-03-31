import React from 'react';
import Flux from 'flummox/component';
import PostFirstImpression from './PostFirstImpression';

const AboutHandler = React.createClass({
  statics: {
    routerWillRun({ flux }) {
      const PageActions = flux.getActions('pages');
      return PageActions.getPageBySlug('about');
    },

    routerDidRun({ state, flux }) {
      const NavActions = flux.getActions('nav');
      NavActions.setColor({ text: '#fff', background: 'rgba(0,0,0,0)' });
    }
  },

  render() {
    return (
      <Flux connectToStores={{
        pages: store => ({
          page: store.getPageBySlug('about')
        })
      }}>
        <AboutPage />
      </Flux>
    );
  }
});

const AboutPage = React.createClass({
  render() {
    const { page } = this.props;

    if (!page) return <span />;

    return (
      <div>
        <PostFirstImpression post={page} noMeta />
      </div>
    );
  }
});

export default AboutHandler;
