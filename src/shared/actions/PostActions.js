'use strict';

import Flux from 'flummox';
import APIService from '../services/APIService';

let PostConstants = Flux.getConstants('PostConstants');

Flux.createActions({

  name: 'PostActions',

  serviceActions: {
    getPosts: [PostConstants.POST_GET_POSTS, function(...args) {
      return APIService.getPosts(...args);
    }],

    getPostBySlug: [PostConstants.POST_GET_POST_BY_SLUG, function(...args) {
      return APIService.getPostBySlug(...args);
    }],
  },

});
