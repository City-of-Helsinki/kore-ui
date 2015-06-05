'use strict';

import _ from 'lodash';

import AppDispatcher from '../core/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import BaseStore from './BaseStore';
import {getItemByIdWrapper} from '../core/utils';

let _schoolBuildings = {};


const SchoolBuildingStore = Object.assign({}, BaseStore, {
  getSchoolBuilding: getItemByIdWrapper(getSchoolBuilding, _schoolBuildings)
});

SchoolBuildingStore.dispatchToken = AppDispatcher.register(function(payload) {
  const action = payload.action;

  switch (action.type) {

    case ActionTypes.REQUEST_SCHOOL_SUCCESS:
      _receiveSchoolBuildings(action.response.entities.schoolBuildings);
      SchoolBuildingStore.emitChange();
      break;

    case ActionTypes.REQUEST_SEARCH_SUCCESS:
      _receiveSchoolBuildings(action.response.entities.schoolBuildings);
      SchoolBuildingStore.emitChange();
      break;

    default:
      // noop
  }
});

function getSchoolBuilding(schoolBuilding) {
  return schoolBuilding;
}

function _receiveSchoolBuildings(schoolBuildings) {
  _.each(schoolBuildings, function(schoolBuilding) {
    _schoolBuildings[schoolBuilding.id] = schoolBuilding;
  });
}

export default SchoolBuildingStore;
