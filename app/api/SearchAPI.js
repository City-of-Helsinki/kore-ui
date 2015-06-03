'use strict';

import request from 'superagent';

import SearchServerActionCreators from '../actions/SearchServerActionCreators';
import {API_ROOT, API_ARGS} from '../constants/AppConstants';
import {decamelize, decamelizeKeys} from 'humps';
import {normalizeSearchResponse} from '../core/APIUtils';

function buildAPIURL(resource) {
  return encodeURI(API_ROOT + resource);
}

function searchRequest(endPoint, query, filters, resultContent) {
  request
    .get(buildAPIURL(endPoint))
    .query('search=' + query)
    .query(decamelizeKeys(filters))
    .query(API_ARGS)
    .end(function(error, response) {
      if (response.ok) {
        SearchServerActionCreators.handleSearchSuccess(
          normalizeSearchResponse(response.body, resultContent),
          resultContent
        );
      } else {
        SearchServerActionCreators.handleSearchError(response.text);
      }
    });
}

export default {
  requestFilter(resource) {
    request
      .get(buildAPIURL(decamelize(resource)))
      .query(API_ARGS)
      .end(function(error, response) {
        if (response.ok) {
          SearchServerActionCreators.handleFilterSuccess(
            response.body,
            resource
          );
        } else {
          SearchServerActionCreators.handleFilterError(response.text);
        }
      });
  },

  searchBuilding(query, filters) {
    searchRequest('school_building/', query, filters, 'buildings');
  },

  searchPrincipal(query, filters) {
    searchRequest('principal/', query, filters, 'principals');
  },

  searchSchool(query, filters) {
    searchRequest('school/', query, filters, 'schools');
  }
};
