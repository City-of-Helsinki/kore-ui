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

function getItemForYear(itemList, year) {
  return _.find(itemList, function(item) {
    return item.begin_year <= year;
  });
}

function sortByYears(list) {
  return _.sortByOrder(list, ['end_year', 'begin_year'], [false, false]);
}

export default {
  getAddressArrayFromBuilding: getAddressArrayFromBuilding,
  getItemForYear: getItemForYear,
  sortByYears: sortByYears
};
