'use strict';

import React from 'react';
import { State } from 'react-router';
import moment from 'moment';

import Flux from 'flummox';
let TwitterActions = Flux.getActions('TwitterActions');
let TwitterStore = Flux.getStore('TwitterStore');

import theme from '../theme';
import Excerpt from './Excerpt';
import Header from './Header';
import Metadata from './Metadata';
import SvgIcon from './SvgIcon';

let style = {
  icon : {
    width: '2rem',
    height: '2rem',
    fill: theme.color('yellow') 
  },
  header: {
    marginTop: '0',
  },
  retweet: {
    width: '2rem',
    height: '2rem',
  },
  hr: {
    color: theme.color('lightGray')
  }
}

let Tweet = React.createClass({ 
  getInitialState() {
    return {
      tweet: TwitterStore.getTweetById(this.props.id),
    };
  },

  componentDidMount() {
    TwitterActions.getTweetById(this.props.id);
    TwitterStore.addListener('change', this.twitterStoreDidChange);
  },
  componentDidUnmount() {
    TwitterStore.addListener('change', this.twitterStoreDidChange);
  },

  twitterStoreDidChange() {
    this.setState({
      tweet: TwitterStore.getTweetById(this.props.id)
    });
  },
  
  formatDate(date) {
    let tweetDate = moment(date, "dd MMM DD HH:mm:ss ZZ YYYY");
    return tweetDate.format('MM.DD.YYYY');
  },

  render() {

    if(!this.state.tweet) {
      return <h1>Tweet not found</h1>;
    }

    //console.log(this.state.tweet.toJS());
    return(
      <div className="TweetContainer">
      <div className="Tweet">
        <div className="Tweet-icon">
          <SvgIcon name="twitter" style={style.icon} />
        </div>
        <div className="Tweet-content">
          <div className="Tweet-content-meta">
            <Header level={2} className="Tweet-content-meta-user" style={style.header}>{this.state.tweet.get('user').get('name')} says:</Header>
            <Metadata className="Tweet-content-meta-date">{this.formatDate(this.state.tweet.get('created_at'))}</Metadata>
          </div>
          <div className="Tweet-content-excerpt">
            <Excerpt>{this.state.tweet.get('text')}</Excerpt>
          </div>
        </div>


      </div>
        <div className="TweetContainer-retweet">
          <SvgIcon name="retweet" style={style.retweet} />
        </div>
        <hr style={style.hr} />
      </div>
    );
  }
});

export default Tweet;
