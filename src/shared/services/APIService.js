'use strict';

import { ensureIsomorphicUrl } from '../utils/LinkUtils';
import request from 'superagent';

/**
 * Get list of posts
 * @param {object} query - Query params
 * @returns {Promise} Resolves to array of posts
 */
export async function getPosts(query = {}) {
  let posts = await request.get(ensureIsomorphicUrl('/api/posts')).query(query).exec();
  return posts.body;
}

/**
 * Get a post by its slug
 * @param {string} slug - post slug
 * @param {object} [query] - Query params
 * @returns {Promise} Resolves to post object
 */
export async function getPostBySlug(slug, query = {}) {
  if (typeof slug !== 'string') {
    throw new Error('slug must be a string');
  }

  let posts = await request.get(ensureIsomorphicUrl(`/api/posts/${slug}`)).query(query).exec();
  return posts.body[0];
}

/**
 * Get list of pages
 * @param {object} query - Query params
 * @returns {Promise} Resolves to array of pages
 */
export async function getPages(query = {}) {
  let pages = await request.get(ensureIsomorphicUrl('/api/pages')).query(query).exec();
  return pages.body;
}

/**
 * Get a page by its slug
 * @param {string} slug - page slug
 * @param {object} [query] - Query params
 * @returns {Promise} Resolves to page object
 */
export async function getPageBySlug(slug, query = {}) {
  if (typeof slug !== 'string') {
    throw new Error('slug must be a string');
  }

  let pages = await request.get(ensureIsomorphicUrl(`/api/pages/${slug}`)).query(query).exec();
  return pages.body[0];
}

/**
 * Get list of projects
 * @param {object} query - Query params
 * @returns {Promise} Resolves to array of projects
 */
export async function getProjects(query = {}) {
  let projects = await request.get(ensureIsomorphicUrl('/api/projects')).query(query).exec();
  return projects.body;
}

/**
 * Get a project by its slug
 * @param {string} slug - project slug
 * @param {object} [query] - Query params
 * @returns {Promise} Resolves to project object
 */
export async function getProjectBySlug(slug, query = {}) {
  if (typeof slug !== 'string') {
    throw new Error('slug must be a string');
  }

  let projects = await request.get(ensureIsomorphicUrl(`/api/projects/${slug}`)).query(query).exec();
  return projects.body[0];
}

export async function getTaxonomyTerms(taxonomyName) {
  const response = await request.get(ensureIsomorphicUrl(`/api/taxonomies/${taxonomyName}/terms`)).exec();

  if (response.body && response.body.terms) return response.body.terms;
}

/**
 * Get list of menus
 * @param {object} query - Query params
 * @returns {Promise} Resolves to array of menus
 */
export async function getMenus(query = {}) {
  let menus = await request.get(ensureIsomorphicUrl('/api/menus')).query(query).exec();
  return menus.body;
}

/**
 * Get list of acf option items
 * @param {object} query - Query params
 * @returns {Promise} Resolves to array of menus
 */
export async function getOptions(query = {}) {
  let options = await request.get(ensureIsomorphicUrl('/api/options')).query(query).exec();
  return options.body;
}
