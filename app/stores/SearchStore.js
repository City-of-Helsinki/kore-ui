'use strict';

import _ from 'lodash';

import ActionTypes from '../constants/ActionTypes';
import {DEFAULT_LAYER} from '../constants/MapConstants';
import AppDispatcher from '../core/AppDispatcher';
import {getMapYears} from '../core/mapUtils';
import BaseStore from './BaseStore';
import SchoolStore from './SchoolStore';

let _fetchingData = 0;
let _filters = {
  type: null,
  field: null,
  language: null,
  gender: null
};
let _filtersOptions = {
  schoolType: [],
  schoolField: [],
  language: [],
  gender: [
    {
      id: 'tyttökoulu',
      name: 'tyttökoulu'
    },
    {
      id: 'poikakoulu',
      name: 'poikakoulu'
    },
    {
      id: 'tyttö- ja poikakoulu',
      name: 'tyttö- ja poikakoulu'
    }
  ]
};
let _filtersOptionsRequested = {
  schoolType: false,
  schoolField: false,
  language: false
};
let _searchQuery = '';
let _selectedMapYear = DEFAULT_LAYER.beginYear;
const _searchResultsDefaults = {
  buildings: null,
  principals: null,
  schools: null
};
let _searchResults = _resetSearchResults();
let _nextPagesUrlDict = _.clone(_searchResultsDefaults);
let _selectedSchool;
let _view = 'grid';
let _years = [null, null];

const SearchStore = Object.assign({}, BaseStore, {
  getFetchingData,
  getFilters,
  getFiltersOptions,
  getFilterOptionsRequested,
  getNextPagesUrlDict,
  getSearchQuery,
  getSearchResults,
  getSelectedMapYear,
  getSelectedSchool,
  getSomethingWasSearched,
  getView,
  getYears
});

SearchStore.dispatchToken = AppDispatcher.register(function(payload) {
  const action = payload.action;

  switch (action.type) {

    case ActionTypes.REQUEST_SEARCH:
      _fetchingData += 3;
      _nextPagesUrlDict = _.clone(_searchResultsDefaults);
      _searchResults = _resetSearchResults();
      _searchQuery = action.query;
      _selectedSchool = null;
      SearchStore.emitChange();
      break;

    case ActionTypes.REQUEST_SEARCH_SUCCESS:
      AppDispatcher.waitFor([SchoolStore.dispatchToken]);
      _fetchingData -= 1;
      _receiveSearchResponse(action.response.entities.searchResponse, action.resultsContent);
      SearchStore.emitChange();
      break;

    case ActionTypes.REQUEST_SEARCH_ERROR:
      _fetchingData -= 1;
      SearchStore.emitChange();
      break;

    case ActionTypes.REQUEST_SEARCH_LOAD_MORE:
      AppDispatcher.waitFor([SchoolStore.dispatchToken]);
      _fetchingData += _.size(action.urls);
      SchoolStore.emitChange();
      break;

    case ActionTypes.SELECT_SEARCH_SCHOOL:
      _selectedSchool = action.school.id;
      SearchStore.emitChange();
      break;

    case ActionTypes.SELECT_SEARCH_VIEW:
      _selectedSchool = null;
      _view = action.view;
      SearchStore.emitChange();
      break;

    case ActionTypes.SELECT_SEARCH_FILTER:
      _applyFilter(action.filterKey, action.optionId);
      break;

    case ActionTypes.REQUEST_FILTER_OPTIONS:
      _filtersOptionsRequested[action.resource] = true;
      break;

    case ActionTypes.REQUEST_SEARCH_FILTER_SUCCESS:
      _receiveFilterResponse(action.response.results, action.resource);
      SearchStore.emitChange();
      break;

    case ActionTypes.SELECT_SEARCH_MAP_YEAR:
      _selectMapYear(action.year);
      SearchStore.emitChange();
      break;

    case ActionTypes.SELECT_SEARCH_TIMELINE_YEAR:
      _selectYears(action.years);
      SearchStore.emitChange();
      break;

    default:
      // noop
  }
});

function getFetchingData() {
  return Boolean(_fetchingData);
}

function getFilters() {
  return _filters;
}

function getFiltersOptions() {
  return _filtersOptions;
}

function getNextPagesUrlDict() {
  return _.pick(_nextPagesUrlDict, _.isString);
}

function getSearchQuery() {
  return _searchQuery;
}

// We need to get the different kind of results
// but the view only support school search still
function getSearchResults() {
  return _searchResults.schools;
}

function getSelectedMapYear() {
  return _selectedMapYear;
}

function getSelectedSchool() {
  return _selectedSchool;
}

function getSomethingWasSearched() {
  return Boolean(_searchQuery || _hasResults() || getFetchingData());
}

function getView() {
  return _view;
}

function getFilterOptionsRequested(filter) {
  return _filtersOptionsRequested[filter];
}

function getYears() {
  return _years;
}

function _applyFilter(filterKey, optionId) {
  const optionsToFilter = {
    'schoolField': 'field',
    'schoolType': 'type',
    'language': 'language',
    'gender': 'gender'
  };
  _filters[optionsToFilter[filterKey]] = optionId;
}

function _hasResults() {
  const resultsLength = _.reduce(_searchResults, function(memo, resultsArray) {
    return memo + resultsArray.length;
  }, 0);
  return Boolean(resultsLength);
}

function _receiveSearchResponse(searchResponse, resultsContent) {
  _nextPagesUrlDict[resultsContent] = searchResponse.next;
  _searchResults[resultsContent] = _searchResults[resultsContent].concat(searchResponse.results);
}

function _receiveFilterResponse(responseResults, resource) {
  _filtersOptions[resource] = responseResults;
}

function _resetSearchResults() {
  return _.mapValues(_searchResultsDefaults, function() {
    return [];
  });
}

function _selectMapYear(year) {
  _selectedMapYear = year;
  _years = getMapYears(year);
}

function _selectYears(years) {
  _years = years;
  if (years[1]) {
    _selectedMapYear = getMapYears(years[1])[0];
  }
}

export default SearchStore;
