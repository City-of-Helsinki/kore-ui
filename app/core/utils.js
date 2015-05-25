'use strict';

import _ from 'lodash';

function getAddressArrayFromBuilding(building) {
  if (building && building.addresses && building.addresses.length) {
    return [
      building.addresses[0].street_name_fi,
      ', ',
      building.addresses[0].municipality_fi
    ];
  }
  return '';
}

function sortByYears(list) {
  return _.sortByOrder(list, ['end_year', 'begin_year'], [false, false]);
}

export default {
  getAddressArrayFromBuilding: getAddressArrayFromBuilding,
  sortByYears: sortByYears
};
