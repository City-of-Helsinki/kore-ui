'use strict';

import _ from 'lodash';
import AppDispatcher from '../core/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import BaseStore from './BaseStore';
import {getAddressString, getItemByIdWrapper, inBetween, sortByYears} from '../core/utils';

let _fetchingData = false;
let _buildings = {};

const BuildingStore = Object.assign({}, BaseStore, {
  getFetchingData,
  getBuilding: getItemByIdWrapper(getBuilding, _buildings),
  getLocationForYear: getItemByIdWrapper(getLocationForYear, _buildings)
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

function getLocationForYear(building, year) {
  const address = _.find(building.addresses, function(current) {
    return inBetween(year, current.begin_year, current.end_year) && !_.isEmpty(current.location);
  }) || {};
  return _.assign({}, address.location, {address: getAddressString(address)});
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
