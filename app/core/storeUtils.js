'use strict';

import _ from 'lodash';

function getAssociationData(associationObjects, getter) {
  return _.map(associationObjects, function(associationObject) {
    return getAssociationObject(associationObject, getter);
  });
}

function getAssociationObject(associationObject, getter) {
  let object = getter(associationObject.id);
  return _.assign({}, object, associationObject);
}

function parseAssociationData(associationObjects, associationIds, objectName) {
  let associationObject;
  return _.map(associationIds, function(id) {
    associationObject = associationObjects[id];
    associationObject.id = associationObject[objectName];
    delete associationObject[objectName];
    return associationObject;
  });
}

export default {
  getAssociationData,
  getAssociationObject,
  parseAssociationData
};
