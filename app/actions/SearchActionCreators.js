'use strict';

import AppDispatcher from '../core/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import SearchAPI from '../api/SearchAPI';
import SearchStore from '../stores/SearchStore';

export default {

  requestSearch(query, filters) {
    AppDispatcher.handleViewAction({
      type: ActionTypes.REQUEST_SEARCH,
      query
    });

    SearchAPI.searchSchool(query, filters);
    SearchAPI.searchBuilding(query, filters);
    SearchAPI.searchPrincipal(query, filters);
  },

  requestLoadMore(urls) {
    AppDispatcher.handleViewAction({
      type: ActionTypes.REQUEST_SEARCH_LOAD_MORE,
      urls
    });

    SearchAPI.searchLoadMore(urls);
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

  selectMapYear(year) {
    AppDispatcher.handleViewAction({
      type: ActionTypes.SELECT_SEARCH_MAP_YEAR,
      year
    });
  },

  selectYears(years) {
    AppDispatcher.handleViewAction({
      type: ActionTypes.SELECT_SEARCH_TIMELINE_YEAR,
      years
    });
  }
};
