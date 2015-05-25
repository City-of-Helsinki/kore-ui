'use strict';

import _ from 'lodash';
import AppDispatcher from '../core/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import BaseStore from './BaseStore';
import {sortByYears} from '../core/utils';

let _fetchingData = false;
let _buildings = {};

const BuildingStore = Object.assign({}, BaseStore, {
  getFetchingData,
  getBuilding: _getBuildingByIdWrapper(getBuilding, {})
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

function _getBuildingByIdWrapper(func, defaultValue) {
  return function(buildingId) {
    defaultValue = defaultValue ? defaultValue : [];
    const building = _buildings[buildingId];
    return _.isEmpty(building) ? defaultValue : func(building);
  };
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
