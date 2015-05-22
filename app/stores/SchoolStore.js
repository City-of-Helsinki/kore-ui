'use strict';

import _ from 'lodash';
import AppDispatcher from '../core/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import BaseStore from './BaseStore';

let _schools = {};
let _fetchingData = false;

const SchoolStore = Object.assign({}, BaseStore, {
  calculateBeginAndEndYear,
  getBuildings,
  getFetchingData,
  getMainBuilding,
  getMainBuildingInYear,
  getMainName,
  getSchool,
  getSchoolDetails,
  getSchoolNames,
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

const getBuildings = _getSchoolByIdWrapper(function(school) {
  return _.sortBy(school.buildings, function(building) {
    return -building.begin_year;
  });
});

const getSchoolNames = _getSchoolByIdWrapper(function(school) {
  return _.sortBy(school.names, function(name) {
    return -name.begin_year;
  });
});

function calculateBeginAndEndYear(schoolId) {
  let sortedNames = getSchoolNames(schoolId);
  let beginYear;
  let endYear;
  if (sortedNames.length) {
    beginYear = sortedNames[sortedNames.length - 1].begin_year;
    endYear = sortedNames[0].end_year;
  }
  return {
    beginYear: beginYear,
    endYear: endYear
  };
}

function getFetchingData() {
  return _fetchingData;
}

function getMainBuilding(schoolId) {
  let sortedBuildings = getBuildings(schoolId);
  if (sortedBuildings.length) {
    return sortedBuildings[0];
  }
  return {};
}

function getMainBuildingInYear(schoolId, year) {
  if (!year) {
    return getMainBuilding(schoolId);
  }
  const buildings = getBuildings(schoolId);
  const building = _.find(buildings, function(build) {
    return build.begin_year <= year;
  });
  return building || {};
}

function getMainName(schoolId) {
  let sortedSchoolNames = getSchoolNames(schoolId);
  if (sortedSchoolNames.length) {
    return sortedSchoolNames[0];
  }
  return {};
}

function getSchool(schoolId) {
  return _schools[schoolId] || {};
}

function getSchoolDetails(schoolId) {
  return {
    schoolNames: getSchoolNames(schoolId),
    buildings: getBuildings(schoolId)
  };
}

function getSchools(schoolIds) {
  return _.map(schoolIds, function(id) {
    const addresses = getMainBuilding(id).building.addresses;
    const address = (
      addresses.length ?
      `${addresses[0].street_name_fi}\, ${addresses[0].municipality_fi}` :
      ''
    );
    return {
      id: id,
      name: getMainName(id).official_name,
      address: address
    };
  }, this);
}

function getSchoolYearDetails(schoolId, year) {
  const schoolNames = getSchoolNames(schoolId);
  const buildings = getBuildings(schoolId);
  if (!year) {
    year = new Date().getFullYear();
  }
  const schoolName = _.find(schoolNames, function(school) {
    return school.begin_year <= year;
  });
  const building = _.find(buildings, function(build) {
    return build.begin_year <= year;
  });
  return {
    schoolName: schoolName || {},
    building: building || {}
  };
}

function hasSchool(schoolId) {
  return typeof _schools[schoolId] !== 'undefined';
}

function _getSchoolByIdWrapper(func, defaultValue) {
  return function(schoolId) {
    if (!defaultValue) {
      defaultValue = [];
    }
    const school = getSchool(schoolId);
    if (_.isEmpty(school)) {
      return defaultValue;
    }
    return func(school);
  };
}

function _receiveSchool(school) {
  _schools[school.id] = school;
}

function _receiveSchools(schools) {
  _.each(schools, _receiveSchool);
}

export default SchoolStore;
