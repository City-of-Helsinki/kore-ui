'use strict';

import _ from 'lodash';
import React from 'react';

const defaultImageUrl = require('../images/default-building.jpg');

function getAddressStringFromBuilding(building) {
  if (building && building.addresses && building.addresses.length) {
    let streets = [];
    _.each(building.addresses, function(address) {
      streets.push(getAddressString(address));
    });
    return streets.join(', ');
  }
  return 'Osoite tuntematon';
}

function getAddressString(address) {
  if (!address || !address.streetNameFi) {
    return 'Osoite tuntematon';
  }
  return address.streetNameFi;
}

function getBoxContent(item) {
  return [
    item.beginYear,
    <i className='fa fa-lg fa-long-arrow-right'/>,
    item.endYear
  ];
}

function getFilterPropType() {
  return React.PropTypes.oneOfType([
    React.PropTypes.number,
    React.PropTypes.string
  ]);
}

function getImageUrl(building) {
  if (!building || !building.photos || !building.photos.length) {
    return defaultImageUrl;
  }
  const photo = _.find(building.photos, 'is_front');
  return photo ? photo.url : building.photos[0].url;
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
    return inBetween(year, item.beginYear, item.endYear);
  });
}

function getItemsForYear(itemList, year) {
  return _.filter(itemList, function(item) {
    return inBetween(year, item.beginYear, item.endYear);
  });
}

function inBetween(year, beginYear, endYear, closedEndYear) {
  beginYear = beginYear || 0;
  endYear = endYear || 10000;
  const delta = closedEndYear ? null : 1;
  return _.inRange(year, beginYear, endYear + delta);
}

function processBasicInfoRow(details, extended) {
  if (_.isEmpty(details.name)) {
    return [];
  }
  let items = [
    {
      key: 'school-name-' + details.name.id,
      className: 'details-school-name',
      name: details.name.officialName,
      boxContent: getBoxContent(details.name)
    },
    {
      key: 'principal-' + details.principal.id,
      className: 'details-principal',
      name: details.principal.name,
      boxContent: getBoxContent(details.principal)
    },
    {
      key: 'school-building-' + details.building.id,
      className: 'details-building',
      name: details.address,
      boxContent: getBoxContent(details.building)
    },
    {
      key: 'school-archive-' + details.archive.id,
      className: 'details-archive',
      name: details.archive.location,
      boxContent: getBoxContent(details.archive)
    }
  ];

  if (extended) {
    items.push(
      {
        key: 'school-info-row-type',
        className: 'details-building',
        name: details.type.type.name,
        boxContent: getBoxContent(details.type)
      },
      {
        key: 'school-info-row-language',
        className: 'details-language',
        name: details.language.language,
        boxContent: getBoxContent(details.language)
      },
      {
        key: 'school-info-row-gender',
        className: 'details-gender',
        name: details.gender.gender,
        boxContent: getBoxContent(details.gender)
      }
    );
  }

  return items;
}

function sortByYears(list) {
  return _.sortByOrder(list, ['endYear', 'beginYear'], [false, false]);
}

export default {
  getAddressStringFromBuilding,
  getAddressString,
  getBoxContent,
  getFilterPropType,
  getImageUrl,
  getItemByIdWrapper,
  getItemForYear,
  getItemsForYear,
  inBetween,
  processBasicInfoRow,
  sortByYears
};
