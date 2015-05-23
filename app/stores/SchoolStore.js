'use strict';

import _ from 'lodash';
import AppDispatcher from '../core/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import BaseStore from './BaseStore';

let _schools = {};
let _fetchingData = false;

const SchoolStore = Object.assign({}, BaseStore, {
  getBeginAndEndYear: _getSchoolByIdWrapper(getBeginAndEndYear, {}),
  getFetchingData,
  getMainBuilding: _getSchoolByIdWrapper(getMainBuilding, {}),
  getMainBuildingInYear,
  getMainName: _getSchoolByIdWrapper(getMainName, {}),
  getSchoolDetails: _getSchoolByIdWrapper(getSchoolDetails, {}),
  getSchoolYearDetails,
  getSchools,
  hasSchool
});

SchoolStore.dispatchToken = AppDispatcher.register(function(payload) {
  const action = payload.action;

  switch (action.type) {

    case ActionTypes.REQUEST_SCHOOL:
      _fetchingData = true;
      SchoolStore.emitChange();
      break;

    case ActionTypes.REQUEST_SCHOOL_SUCCESS:
    _fetchingData = false;
      _receiveSchool(action.response);
      SchoolStore.emitChange();
      break;

    case ActionTypes.REQUEST_SEARCH_SUCCESS:
      _receiveSchools(action.response.results);
      SchoolStore.emitChange();
      break;

    default:
      // noop
  }
});

function getBeginAndEndYear(school) {
  const currentName = _.first(school.names);
  const oldestName = _.last(school.names);
  return {
    beginYear: oldestName ? oldestName.begin_year : null,
    endYear: currentName ? currentName.end_year : null
  };
}

function getFetchingData() {
  return _fetchingData;
}

function getMainBuilding(school) {
  return _.first(school.buildings) || {};
}

function getMainBuildingInYear(schoolId, year) {
  const school = _schools[schoolId];
  if (_.isEmpty(school)) {
    return {};
  }
  if (!year) {
    return getMainBuilding(school);
  }
  return _getItemForYear(school, 'buildings', year) || {};
}

function getMainName(school) {
  return _.first(school.names) || {};
}

function getSchoolDetails(school) {
  return {
    archives: school.archives,
    buildings: school.buildings,
    names: school.names
  };
}

function getSchools(schoolIds) {
  return _.map(schoolIds, function(id) {
    const school = _schools[id];
    if (_.isEmpty(school)) {
      return {};
    }
    let addresses = [];
    const mainBuilding = getMainBuilding(school);
    if (mainBuilding.building && mainBuilding.building.addresses) {
      addresses = mainBuilding.building.addresses;
    }
    const address = (
      addresses.length ?
      `${addresses[0].street_name_fi}\, ${addresses[0].municipality_fi}` :
      ''
    );
    return {
      id: id,
      name: getMainName(school).official_name,
      address: address
    };
  }, this);
}

function getSchoolYearDetails(schoolId, year) {
  const school = _schools[schoolId];
  if (_.isEmpty(school)) {
    return {};
  }
  year = year || new Date().getFullYear();

  return {
    schoolName: _getItemForYear(school, 'names', year) || {},
    building: _getItemForYear(school, 'buildings', year) || {},
    archive: _getItemForYear(school, 'archives', year) || {}
  };
}

function hasSchool(schoolId) {
  return typeof _schools[schoolId] !== 'undefined';
}

function _getItemForYear(school, itemListName, year) {
  return _.find(school[itemListName], function(item) {
    return item.begin_year <= year;
  });
}

function _getSchoolByIdWrapper(func, defaultValue) {
  return function(schoolId) {
    defaultValue = defaultValue ? defaultValue : [];
    const school = _schools[schoolId];
    return _.isEmpty(school) ? defaultValue : func(school);
  };
}

function _receiveSchool(school) {
  _schools[school.id] = {
    id: school.id,
    names: _.sortByOrder(school.names, ['end_year', 'begin_year'], [false, false]),
    buildings: _.sortByOrder(school.buildings, ['end_year', 'begin_year'], [false, false]),
    archives: _.sortByOrder(school.archives, ['end_year', 'begin_year'], [false, false])
  };
}

function _receiveSchools(schools) {
  _.each(schools, _receiveSchool);
}

export default SchoolStore;
