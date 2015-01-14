'use strict';

import request from 'superagent';
import isNode from 'detect-node';
import _url from 'url';

/**
 * In non-browser contexts, if no hostname is given, format with `localhost`
 * as host and the proper port. Otherwise return as-is.
 * @param {string} url
 * @returns {string} Formatted url
 */
export function ensureIsomorphicUrl(url) {
  return isNode
    ? _url.resolve('http://localhost' + (process.env.PORT ? `:${process.env.PORT}` : ''), url)
    : url;
}

/**
 * Get root url.
 * @return {string} url
 */
export function rootUrl() {
  if (typeof window !== 'undefined') {
    return `${window.location.protocol}//${window.location.host}`;
  } else if (isNode) {
    return 'http://localhost' + (process.env.PORT ? `:${process.env.PORT}` : '');
  }
}

/**
 * Check if url is a local url
 * @param {string} url
 * @returns {boolean}
 */
export function isLocalUrl(url) {
  let host = _url.parse(url, false, true).host;
  let rootHost = _url.parse(rootUrl(), false, true).host;

  if (!host) {
    return true;
  }

  return host === rootHost;
}

/**
 * Check if url references the WordPress backend.
 * @param {string} url
 */
export function isWPUrl(url) {
  let urlObj = _url.parse(url, false, true);

  let host = urlObj.host;
  let wpHost = _url.parse(process.env.WP_ENDPOINT).host;

  if (!host) {
    return false;
  }

  if (urlObj.path && urlObj.path.startsWith('/wp-content')) {
    return false;
  }

  return host === wpHost;
}

/**
 * Remove host from url, so that it begins with '/'. If there is no host,
 * do nothing.
 * @param {[type]} url [description]
 */
export function removeHost(url) {
  let urlObj = _url.parse(url, false, true);

  if (!urlObj.host) {
    return url;
  }

  return urlObj.path;
}