'use strict';

import _ from 'lodash';
import Fuse from 'fuse.js';

import AppDispatcher from '../core/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import BaseStore from './BaseStore';
import SchoolStore from './SchoolStore';
import SchoolBuildingStore from './SchoolBuildingStore';
import {
  getAddressString,
  getItemByIdWrapper,
  inBetween,
  sortByYears
} from '../core/utils';

let _fetchingData = false;
let _buildings = {};


const BuildingStore = Object.assign({}, BaseStore, {
  getBuilding: getItemByIdWrapper(getBuilding, _buildings),
  getFetchingData,
  getLocationsForYear,
  getSearchDetails: getItemByIdWrapper(getSearchDetails, _buildings)
});

BuildingStore.dispatchToken = AppDispatcher.register(function(payload) {
  const action = payload.action;

  switch (action.type) {

    case ActionTypes.REQUEST_SCHOOL:
      _fetchingData = true;
      BuildingStore.emitChange();
      break;

    case ActionTypes.REQUEST_SCHOOL_SUCCESS:
      _fetchingData = false;
      _receiveBuildings(action.response.entities.buildings);
      BuildingStore.emitChange();
      break;

    case ActionTypes.REQUEST_SEARCH_SUCCESS:
      _receiveBuildings(action.response.entities.buildings);
      BuildingStore.emitChange();
      break;

    default:
      // noop
  }
});

function getFetchingData() {
  return _fetchingData;
}

function getBuilding(building) {
  return building;
}

function getSearchDetails(building, schoolId, query) {
  let addressSearchIndex = new Fuse(
    building.addresses,
    {keys: [
      'municipalityFi',
      'municipalitySv',
      'streetNameFi',
      'streetNameSv'
    ]}
  );
  const schoolBuilding = SchoolBuildingStore.getSchoolBuilding(schoolId + '-' + building.id);
  const addresses = addressSearchIndex.search(query);
  const schoolBuildingAdddresses = addresses.map(function(address) {
    let _address = _.clone(address);
    if (_address.beginYear < schoolBuilding.beginYear) {
      _address.beginYear = schoolBuilding.beginYear;
    }
    if (_address.endYear > schoolBuilding.endYear) {
      _address.endYear = schoolBuilding.endYear;
    }
    return _address;
  });
  return SchoolStore.getSchoolYearDetailsForNameInPeriod(schoolId, schoolBuildingAdddresses);
}

function getLocationsForYear(buildingIds, year) {
  let locations = [];
  _.each(buildingIds, function(buildingId) {
    const address = _.find(_buildings[buildingId].addresses, function(current) {
      return inBetween(year, current.beginYear, current.endYear) && !_.isEmpty(current.location);
    }) || {};
    const locationId = buildingId + '-' + address.id;
    locations.push(
      _.assign({}, address.location, {address: getAddressString(address), id: locationId})
    );
  });
  return locations;
}

function _receiveBuildings(buildings) {
  _.each(buildings, function(building) {
    _buildings[building.id] = {
      addresses: sortByYears(building.addresses),
      architect: building.architect,
      id: building.id,
      neighborhood: building.neighborhood
    };
  });
}

export default BuildingStore;
