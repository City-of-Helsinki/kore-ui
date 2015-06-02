'use strict';

import AppDispatcher from '../core/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import SchoolAPI from '../api/SchoolAPI';
import SearchAPI from '../api/SearchAPI';
import SearchStore from '../stores/SearchStore';

export default {

  requestSearch(query, filters) {
    AppDispatcher.handleViewAction({
      type: ActionTypes.REQUEST_SEARCH,
      query
    });

    SchoolAPI.searchSchool(query, filters);
  },

  requestLoadMore(url) {
    AppDispatcher.handleViewAction({
      type: ActionTypes.REQUEST_SEARCH_LOAD_MORE
    });

    SchoolAPI.searchLoadMore(url);
  },

  selectSchool(school) {
    AppDispatcher.handleViewAction({
      type: ActionTypes.SELECT_SEARCH_SCHOOL,
      school
    });
  },

  selectView(view) {
    AppDispatcher.handleViewAction({
      type: ActionTypes.SELECT_SEARCH_VIEW,
      view
    });
  },

  selectFilter(filterKey, optionId) {
    AppDispatcher.handleViewAction({
      type: ActionTypes.SELECT_SEARCH_FILTER,
      filterKey,
      optionId
    });
  },

  requestFilterOptions(resource) {
    if (SearchStore.getFilterOptionsRequested(resource)) {
      return;
    }

    AppDispatcher.handleViewAction({
      type: ActionTypes.REQUEST_FILTER_OPTIONS,
      resource
    });
    SearchAPI.requestFilter(resource);
  },

  selectYears(years) {
    AppDispatcher.handleViewAction({
      type: ActionTypes.SELECT_SEARCH_TIMELINE_YEAR,
      years
    });
  }
};
