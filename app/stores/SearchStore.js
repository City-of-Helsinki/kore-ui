'use strict';

import AppDispatcher from '../core/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import BaseStore from './BaseStore';

let _fetchingData = false;
let _searchQuery = '';
let _searchResults = [];

const SearchStore = Object.assign({}, BaseStore, {
  getFetchingData: function() {
    return _fetchingData;
  },

  getSearchQuery: function() {
    return _searchQuery;
  },

  getSearchResults: function() {
    return _searchResults;
  }
});

SearchStore.dispatchToken = AppDispatcher.register(function(payload) {
  const action = payload.action;

  switch (action.type) {

    case ActionTypes.REQUEST_SEARCH:
      _fetchingData = true;
      _searchQuery = action.query;
      SearchStore.emitChange();
      break;

    case ActionTypes.REQUEST_SEARCH_SUCCESS:
      _fetchingData = false;
      _receiveSearchResults(action.response.results);
      SearchStore.emitChange();
      break;

    default:
      // noop
  }
});

function _receiveSearchResults(schools) {
  _searchResults = schools.map(function(school) {
    return school.id;
  });
}

export default SearchStore;
