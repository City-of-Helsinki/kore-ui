'use strict';

import _ from 'lodash';
import AppDispatcher from '../core/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import BaseStore from './BaseStore';
import {getItemByIdWrapper} from '../core/utils';

let _fetchingData = false;
let _principals = {};

const PrincipalStore = Object.assign({}, BaseStore, {
  getFetchingData,
  getPrincipal: getItemByIdWrapper(getPrincipal, _principals)
});

PrincipalStore.dispatchToken = AppDispatcher.register(function(payload) {
  const action = payload.action;

  switch (action.type) {

    case ActionTypes.REQUEST_SCHOOL:
      _fetchingData = true;
      PrincipalStore.emitChange();
      break;

    case ActionTypes.REQUEST_SCHOOL_SUCCESS:
      _fetchingData = false;
      _receivePrincipals(action.response.entities.principals);
      PrincipalStore.emitChange();
      break;

    case ActionTypes.REQUEST_SEARCH_SUCCESS:
      _receivePrincipals(action.response.entities.principals);
      PrincipalStore.emitChange();
      break;

    default:
      // noop
  }
});

function getFetchingData() {
  return _fetchingData;
}

function getPrincipal(principal) {
  return principal;
}

function _receivePrincipals(principals) {
  _.each(principals, function(principal) {
    _principals[principal.id] = {
      employers: principal.employers,
      firstName: principal.first_name,
      id: principal.id,
      name: principal.first_name + ' ' + principal.surname,
      surname: principal.surname
    };
  });
}

export default PrincipalStore;
