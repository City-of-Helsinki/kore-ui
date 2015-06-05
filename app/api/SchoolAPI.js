'use strict';

import request from 'superagent';

import SchoolServerActionCreators from '../actions/SchoolServerActionCreators';
import {API_ROOT, API_ARGS} from '../constants/AppConstants';
import {normalizeSchoolResponse} from '../core/APIUtils';

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
  }
};
