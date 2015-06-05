'use strict';

import {Schema, arrayOf, normalize} from 'normalizr';
import {camelizeKeys} from 'humps';

const building = new Schema('buildings');
const principal = new Schema('principals');
const schoolBuilding = new Schema('schoolBuildings');
const schoolPrincipal = new Schema('schoolPrincipals');
const school = new Schema('schools');
const employer = new Schema('employer');
// We need to define a searchRespone shema so normalizr finds all entities from
// the search results.
const schoolSearchResponse = new Schema('schoolSearchResponse');
const buildingSearchResponse = new Schema('buildingSearchResponse');
const principalSearchResponse = new Schema('principalSearchResponse');

schoolBuilding.define({
  building: building,
  school: school
});

schoolPrincipal.define({
  principal: principal
});

employer.define({
  school: school
});

principal.define({
  employers: arrayOf(employer)
});


school.define({
  buildings: arrayOf(schoolBuilding),
  principals: arrayOf(schoolPrincipal)
});

schoolSearchResponse.define({
  results: arrayOf(school)
});

buildingSearchResponse.define({
  results: arrayOf(schoolBuilding)
});

principalSearchResponse.define({
  results: arrayOf(principal)
});

const resultsSchemas = {
  schools: [schoolSearchResponse, 'schoolSearchResponse'],
  buildings: [buildingSearchResponse, 'buildingSearchResponse'],
  principals: [principalSearchResponse, 'principalSearchResponse']
};

export function normalizeSchoolResponse(response) {
  const camelized = camelizeKeys(response);
  return normalize(camelized, school);
}

export function normalizeSearchResponse(response, resultsContent) {
  const camelized = camelizeKeys(response);
  const resultsSchema = resultsSchemas[resultsContent];
  let normalized = normalize(camelized, resultsSchema[0]);
  // The searchResponse does not have an id so after normalizr the data is behind
  // an undefined property. Let's change that here.
  normalized.entities.searchResponse = normalized.entities[resultsSchema[1]].undefined;
  return normalized;
}
