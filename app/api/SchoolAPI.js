'use strict';

import request from 'superagent';

import SchoolServerActionCreators from '../actions/SchoolServerActionCreators';
import SearchServerActionCreators from '../actions/SearchServerActionCreators';
import {API_ROOT, API_ARGS} from '../constants/AppConstants';
import {normalizeSchoolResponse, normalizeSearchResponse} from '../core/APIUtils';

function buildAPIURL(resource) {
  return encodeURI(API_ROOT + resource);
}

export default {
  requestSchool(schoolId) {
    request
      .get(buildAPIURL('school/' + schoolId))
      .query(API_ARGS)
      .end(function(error, response) {
        if (response.ok) {
          SchoolServerActionCreators.handleSchoolSuccess(
            normalizeSchoolResponse(response.body)
          );
        } else {
          SchoolServerActionCreators.handleSchoolError(response.text);
        }
      });
  },

  searchLoadMore(url) {
    request
      .get(url)
      .end(function(error, response) {
        if (response.ok) {
          SearchServerActionCreators.handleSearchSuccess(
            normalizeSearchResponse(response.body)
          );
        } else {
          SearchServerActionCreators.handleSearchError(response.text);
        }
      });
  }
};
