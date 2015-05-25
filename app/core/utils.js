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

function getAddressString(address) {
  const street = address.street_name_fi || '';
  const municipality = address.municipality_fi || '';
  return `${street}\, ${municipality}`;
}

function getItemByIdWrapper(func, items, defaultValue) {
  return function(itemId) {
    defaultValue = defaultValue ? defaultValue : {};
    const item = items[itemId];
    let newArgs = Array.prototype.slice.call(arguments, 1);
    newArgs.unshift(item);
    return _.isEmpty(item) ? defaultValue : func.apply(null, newArgs);
  };
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
  getAddressString: getAddressString,
  getItemByIdWrapper: getItemByIdWrapper,
  getItemForYear: getItemForYear,
  sortByYears: sortByYears
};
