'use strict';

import _ from 'lodash';

import ActionTypes from '../constants/ActionTypes';
import {DEFAULT_LAYER} from '../constants/MapConstants';
import AppDispatcher from '../core/AppDispatcher';
import {getMapYears} from '../core/mapUtils';
import BaseStore from './BaseStore';
import SchoolStore from './SchoolStore';

let _actualSearchYears = [null, null];
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
let _infoText = null;
let _searchQuery = '';
let _selectedMapYear = String(DEFAULT_LAYER.beginYear);
const _searchResultsDefaults = {
  buildings: null,
  employerships: null,
  schools: null
};
let _searchResults = _resetSearchResults();
let _nextPagesUrlDict = _.clone(_searchResultsDefaults);
let _selectedSchoolId;
let _view = 'table';
let _years = [null, null];

const SearchStore = Object.assign({}, BaseStore, {
  getActualSearchYears,
  getFetchingData,
  getFilters,
  getFiltersOptions,
  getFilterOptionsRequested,
  getInfoText,
  getNextPagesUrlDict,
  getSearchQuery,
  getSearchResults,
  getSelectedMapYear,
  getSelectedSchoolId,
  getSomethingWasSearched,
  getView,
  getYears
});

SearchStore.dispatchToken = AppDispatcher.register(function(payload) {
  const action = payload.action;

  switch (action.type) {

    case ActionTypes.REQUEST_SEARCH:
      _actualSearchYears = _years;
      _fetchingData += 3;
      _infoText = null;
      _nextPagesUrlDict = _.clone(_searchResultsDefaults);
      _searchResults = _resetSearchResults();
      _searchQuery = action.query;
      _selectedSchoolId = null;
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
      _handleErrorMessage(action.error);
      SearchStore.emitChange();
      break;

    case ActionTypes.REQUEST_SEARCH_LOAD_MORE:
      AppDispatcher.waitFor([SchoolStore.dispatchToken]);
      _fetchingData += _.size(action.urls);
      SchoolStore.emitChange();
      break;

    case ActionTypes.SELECT_SEARCH_SCHOOL:
      _selectedSchoolId = action.schoolId;
      SearchStore.emitChange();
      break;

    case ActionTypes.SELECT_SEARCH_VIEW:
      _selectedSchoolId = null;
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

function getActualSearchYears() {
  return _actualSearchYears;
}

function getFetchingData() {
  return Boolean(_fetchingData);
}

function getFilters() {
  return _filters;
}

function getFiltersOptions() {
  return _filtersOptions;
}

function getInfoText() {
  return _infoText;
}

function getNextPagesUrlDict() {
  return _.pick(_nextPagesUrlDict, _.isString);
}

function getSearchQuery() {
  return _searchQuery;
}

function getSearchResults() {
  return _searchResults;
}

function getSelectedMapYear() {
  return _selectedMapYear;
}

function getSelectedSchoolId() {
  return _selectedSchoolId;
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

function _handleErrorMessage(message) {
  if (_.includes(message, 'enter at least')) {
    _infoText = `
      Jos haluat nähdä myös rehtoreihin osuneita hakutuloksia,
      syötä vähintää neljä merkkiä hakukenttään.
    `;
  }
}

function _hasResults() {
  const resultsLength = _.reduce(_searchResults, function(memo, resultsArray) {
    return memo + resultsArray.length;
  }, 0);
  return Boolean(resultsLength);
}

function _receiveSearchResponse(searchResponse, resultsContent) {
  _nextPagesUrlDict[resultsContent] = searchResponse.next;
  _searchResults[resultsContent] = _searchResults[resultsContent].concat(
    _.uniq(searchResponse.results)
  );
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
  _selectedMapYear = String(year);
  _years = getMapYears(year);
}

function _selectYears(years) {
  _years = years;
  if (years[1]) {
    _selectedMapYear = String(getMapYears(years[1])[0]);
  }
}

export default SearchStore;
