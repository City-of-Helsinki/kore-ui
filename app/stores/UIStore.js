'use strict';

import AppDispatcher from '../core/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import BaseStore from './BaseStore';

let _schoolTimelineYear = null;

const UIStore = Object.assign({}, BaseStore, {
  getSchoolTimelineYear
});

UIStore.dispatchToken = AppDispatcher.register(function(payload) {
  const action = payload.action;

  switch (action.type) {

    case ActionTypes.UPDATE_SCHOOL_TIMELINE_YEAR:
      _updateYear(action.year);
      UIStore.emitChange();
      break;

    case ActionTypes.RESET_SCHOOL_TIMELINE_YEAR:
      _updateYear(null);
      UIStore.emitChange();
      break;

    default:
      // noop
  }
});

function getSchoolTimelineYear() {
  return _schoolTimelineYear;
}

function _updateYear(year) {
  _schoolTimelineYear = year;
}

export default UIStore;
