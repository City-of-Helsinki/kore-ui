'use strict';

import _ from 'lodash';
import AppDispatcher from '../core/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import BaseStore from './BaseStore';

let _schools = {};
let _fetchingData = false;

const getSchoolByIdWrapper = function(func, defaultValue) {
  return function(schoolId) {
    if (!defaultValue) {
      defaultValue = [];
    }
    const school = this.getSchool(schoolId);
    if (_.isEmpty(school)) {
      return defaultValue;
    }
    return func(school);
  };
};

const SchoolStore = Object.assign({}, BaseStore, {
  getFetchingData: function() {
    return _fetchingData;
  },

  getSchool: function(schoolId) {
    return _schools[schoolId] || {};
  },

  getSchools: function(schoolIds) {
    return _.map(schoolIds, function(id) {
      const addresses = this.getMainBuilding(id).building.addresses;
      const address = (
        addresses.length ?
        `${addresses[0].street_name_fi}\, ${addresses[0].municipality_fi}` :
        ''
      );
      return {
        id: id,
        name: this.getMainName(id).official_name,
        address: address
      };
    }, this);
  },

  hasSchool: function(schoolId) {
    return typeof _schools[schoolId] !== 'undefined';
  },

  getMainName: function(schoolId) {
    let sortedSchoolNames = this.getSchoolNames(schoolId);
    if (sortedSchoolNames.length) {
      return sortedSchoolNames[0];
    }
    return {};
  },

  getMainBuilding: function(schoolId) {
    let sortedBuildings = this.getBuildings(schoolId);
    if (sortedBuildings.length) {
      return sortedBuildings[0];
    }
    return {};
  },

  getSchoolNames: getSchoolByIdWrapper(function(school) {
    return _.sortBy(school.names, function(name) {
      return -name.begin_year;
    });
  }),

  getBuildings: getSchoolByIdWrapper(function(school) {
    return _.sortBy(school.buildings, function(building) {
      return -building.begin_year;
    });
  }),

  getMainBuildingInYear: function(schoolId, year) {
    if (!year) {
      return this.getMainBuilding(schoolId);
    }
    const buildings = this.getBuildings(schoolId);
    const building = _.find(buildings, function(build) {
      return build.begin_year <= year;
    });
    return building || {};
  },

  getSchoolDetails: function(schoolId) {
    return {
      schoolNames: this.getSchoolNames(schoolId),
      buildings: this.getBuildings(schoolId)
    };
  },

  getSchoolYearDetails: function(schoolId, year) {
    const schoolNames = this.getSchoolNames(schoolId);
    const buildings = this.getBuildings(schoolId);
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
  },

  calculateBeginAndEndYear: function(schoolId) {
    let sortedNames = this.getSchoolNames(schoolId);
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

function _receiveSchool(school) {
  _schools[school.id] = school;
}

function _receiveSchools(schools) {
  _.each(schools, _receiveSchool);
}

export default SchoolStore;
