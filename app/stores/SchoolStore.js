'use strict';

import _ from 'lodash';
import AppDispatcher from '../core/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import BaseStore from './BaseStore';
import BuildingStore from './BuildingStore';
import PrincipalStore from './PrincipalStore';
import {
  inBetween,
  getAddressString,
  getItemByIdWrapper,
  getItemForYear,
  getItemsForYear,
  sortByYears
} from '../core/utils';
import {
  getAssociationData,
  getAssociationObject,
  parseAssociationData
} from '../core/storeUtils';

let _schools = {};
let _fetchingData = false;

const SchoolStore = Object.assign({}, BaseStore, {
  getBeginAndEndYear: getItemByIdWrapper(getBeginAndEndYear, _schools),
  getBuildingForYear: getItemByIdWrapper(getBuildingForYear, _schools),
  getFetchingData,
  getLocationsForYear: getItemByIdWrapper(getLocationsForYear, _schools),
  getNameInSelectedYear: getItemByIdWrapper(getNameInSelectedYear, _schools),
  getSchool: getItemByIdWrapper(getSchool, _schools),
  getSchoolDetails: getItemByIdWrapper(getSchoolDetails, _schools),
  getNameYearsInPeriod: getItemByIdWrapper(getNameYearsInPeriod, _schools, []),
  getSchoolYearDetails: getItemByIdWrapper(getSchoolYearDetails, _schools),
  getSchoolsYearDetails,
  hasSchool
});

SchoolStore.dispatchToken = AppDispatcher.register(function(payload) {
  AppDispatcher.waitFor([
    BuildingStore.dispatchToken,
    PrincipalStore.dispatchToken
  ]);

  const action = payload.action;

  switch (action.type) {

    case ActionTypes.REQUEST_SCHOOL:
      _fetchingData = true;
      SchoolStore.emitChange();
      break;

    case ActionTypes.REQUEST_SCHOOL_SUCCESS:
      _fetchingData = false;
      _receiveSchools(action.response.entities);
      SchoolStore.emitChange();
      break;

    case ActionTypes.REQUEST_SEARCH_LOAD_MORE:
      SchoolStore.emitChange();
      break;

    case ActionTypes.REQUEST_SEARCH_SUCCESS:
      _receiveSchools(action.response.entities);
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
    beginYear: oldestName ? oldestName.beginYear : null,
    endYear: currentName ? currentName.endYear : null
  };
}

function getBuildingForYear(school, year) {
  year = year || _getLatestYear(school);
  return getItemForYear(school.buildings, year) || {};
}

function getLocationsForYear(school, year) {
  year = year || _getLatestYear(school);
  const buildings = getItemsForYear(school.buildings, year);
  return BuildingStore.getLocationsForYear(_.pluck(buildings, 'id'), year);
}

function getFetchingData() {
  return _fetchingData;
}

function getNameInSelectedYear(school, year) {
  year = year || _getLatestYear(school);
  return getItemForYear(school.names, year) || {};
}

function getSchool(school) {
  return school;
}

function getSchoolDetails(school, selectedYear) {
  selectedYear = selectedYear || _getLatestYear(school);
  return {
    archives: school.archives,
    buildings: getAssociationData(school.buildings, BuildingStore.getBuilding),
    fields: school.fields,
    genders: school.genders,
    languages: school.languages,
    names: school.names,
    principals: getAssociationData(school.principals, PrincipalStore.getPrincipal),
    selectedYear: selectedYear,
    types: school.types
  };
}

function getSchoolYearDetails(school, year) {
  year = year || _getLatestYear(school);
  const schoolBuilding = getItemForYear(school.buildings, year);
  const building = (
    schoolBuilding ? getAssociationObject(schoolBuilding, BuildingStore.getBuilding) : {}
  );
  const schoolPrincipal = getItemForYear(school.principals, year);
  const principal = (
    schoolPrincipal ? getAssociationObject(schoolPrincipal, PrincipalStore.getPrincipal) : {}
  );
  const address = getItemForYear(building.addresses, year);
  return {
    address: getAddressString(address),
    archive: getItemForYear(school.archives, year) || {},
    building: building,
    gender: getItemForYear(school.genders, year) || {},
    id: school.id,
    language: getItemForYear(school.languages, year) || {},
    location: _.first(getLocationsForYear(school, year)) || {},
    name: getItemForYear(school.names, year) || {},
    principal: principal,
    type: getItemForYear(school.types, year) || {}
  };
}

function getNameYearsInPeriod(school, beginYear, endYear) {
  let years = [beginYear];
  _.each(school.names.reverse(), function(name) {
    if (inBetween(name.beginYear, beginYear + 1, endYear)) {
      years.push(name.beginYear);
    }
  });
  return years;
}

function getSchoolsYearDetails(schoolIds, year) {
  return _.map(schoolIds, function(id) {
    return SchoolStore.getSchoolYearDetails(id, year);
  }, this);
}

function hasSchool(schoolId) {
  return typeof _schools[schoolId] !== 'undefined';
}

function _getLatestYear(school) {
  return getBeginAndEndYear(school).endYear || new Date().getFullYear();
}

function _receiveSchools(entities) {
  _.each(entities.schools, function(school) {
    let _school = _schools[school.id];
    if (!_school) {
      _school = {
        buildings: [],
        principals: []
      };
    }
    let associatedData = {};
    if (school.buildings && school.buildings.length) {
      associatedData.buildings = sortByYears(parseAssociationData(
        entities.schoolBuildings,
        school.buildings,
        'building'
      ));
    }
    if (school.principals && school.principals.length) {
      associatedData.principals = sortByYears(parseAssociationData(
        entities.schoolPrincipals,
        school.principals,
        'principal'
      ));
    }
    _.assign(
      _school,
      {
        archives: sortByYears(school.archives),
        fields: sortByYears(school.fields),
        genders: sortByYears(school.genders),
        id: school.id,
        languages: sortByYears(school.languages),
        names: sortByYears(school.names),
        types: sortByYears(school.types)
      },
      associatedData
    );
    _schools[school.id] = _school;
  });
}

export default SchoolStore;
