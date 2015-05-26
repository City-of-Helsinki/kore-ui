'use strict';

import _ from 'lodash';
import React from 'react';
import InfoTable from './InfoTable';
import {getAddressArrayFromBuilding, getBoxContent} from '../core/utils';

const itemGenerator = {
  archives: function(archives) {
    return _.map(archives, function(archive, index) {
      return {
        key: 'school-archive-' + index,
        className: 'details-archive',
        name: archive.location,
        boxContent: getBoxContent(archive)
      };
    });
  },
  buildings: function(buildings) {
    return _.map(buildings, function(building) {
      return {
        key: 'building-' + building.id,
        className: 'details-building',
        name: getAddressArrayFromBuilding(building),
        boxContent: getBoxContent(building),
        items: [
          {
            key: 'neighborhood-of-building-' + building.id,
            name: building.neighborhood,
            boxContent: 'alue'
          },
          {
            key: 'architect-of-building-' + building.id,
            name: building.architect,
            boxContent: 'arkkitehti'
          }
        ]
      };
    });
  },
  fields: function(fields) {
    return _.map(fields, function(field, index) {
      return {
        key: 'school-field-' + index,
        className: 'details-field',
        name: field.field.description,
        boxContent: getBoxContent(field)
      };
    });
  },
  genders: function(genders) {
    return _.map(genders, function(gender, index) {
      return {
        key: 'school-gender-' + index,
        className: 'details-gender',
        name: gender.gender,
        boxContent: getBoxContent(gender)
      };
    });
  },
  languages: function(languages) {
    return _.map(languages, function(language) {
      return {
        key: 'school-language-' + language.id,
        className: 'details-language',
        name: language.language,
        boxContent: getBoxContent(language)
      };
    });
  },
  names: function(names) {
    return _.map(names, function(name) {
      return {
        key: 'school-name-' + name.id,
        className: 'details-school-name',
        name: name.officialName,
        boxContent: getBoxContent(name)
      };
    });
  },
  principals: function(principals) {
    return _.map(principals, function(principal) {
      return {
        key: 'principal-' + principal.id,
        className: 'details-principal',
        name: principal.name,
        boxContent: getBoxContent(principal)
      };
    });
  },
  types: function(types) {
    return _.map(types, function(type, index) {
      return {
        key: 'school-type-' + index,
        className: 'details-building',
        name: type.type.name,
        boxContent: getBoxContent(type)
      };
    });
  }
};

class SchoolDetails extends React.Component {
  render() {
    const details = this.props.details;
    return (
      <div className='container'>
        <section className='school-details'>
          <InfoTable
            title={'Koulun nimet'}
            expandable={false}
            items={itemGenerator.names(details.names)}
          />
          <InfoTable
            title={'Rakennukset ja sijainnit'}
            expandable={true}
            items={itemGenerator.buildings(details.buildings)}
          />
          <InfoTable
            title={'Arkistot'}
            expandable={true}
            items={itemGenerator.archives(details.archives)}
          />
          <InfoTable
            title={'Rehtorit'}
            expandable={true}
            items={itemGenerator.principals(details.principals)}
          />
          <InfoTable
            title={'Koulun tyypit'}
            expandable={true}
            items={itemGenerator.types(details.types)}
          />
          <InfoTable
            title={'Koulun alat'}
            expandable={true}
            items={itemGenerator.fields(details.fields)}
          />
          <InfoTable
            title={'Kielet'}
            expandable={true}
            items={itemGenerator.languages(details.languages)}
          />
          <InfoTable
            title={'Sukupuolet'}
            expandable={true}
            items={itemGenerator.genders(details.genders)}
          />
        </section>
      </div>
    );
  }
}

SchoolDetails.propTypes = {
  details: React.PropTypes.shape({
    archives: React.PropTypes.arrayOf(
      React.PropTypes.shape({
        location: React.PropTypes.string,
        beginYear: React.PropTypes.number,
        endYear: React.PropTypes.number
      })
    ),
    buildings: React.PropTypes.arrayOf(
      React.PropTypes.shape({
        beginYear: React.PropTypes.number,
        endYear: React.PropTypes.number,
        building: React.PropTypes.shape({
          neighborhood: React.PropTypes.string,
          architect: React.PropTypes.string,
          addresses: React.PropTypes.arrayOf(
            React.PropTypes.shape({
              streetNameFi: React.PropTypes.string,
              municipalityFi: React.PropTypes.string
            })
          )
        })
      })
    ),
    fields: React.PropTypes.arrayOf(
      React.PropTypes.shape({
        field: React.PropTypes.shape({
          description: React.PropTypes.string
        }),
        beginYear: React.PropTypes.number,
        endYear: React.PropTypes.number
      })
    ),
    genders: React.PropTypes.arrayOf(
      React.PropTypes.shape({
        gender: React.PropTypes.string,
        beginYear: React.PropTypes.number,
        endYear: React.PropTypes.number
      })
    ),
    languages: React.PropTypes.arrayOf(
      React.PropTypes.shape({
        language: React.PropTypes.string,
        beginYear: React.PropTypes.number,
        endYear: React.PropTypes.number
      })
    ),
    names: React.PropTypes.arrayOf(
      React.PropTypes.shape({
        officialName: React.PropTypes.string,
        beginYear: React.PropTypes.number,
        endYear: React.PropTypes.number
      })
    ),
    principals: React.PropTypes.arrayOf(
      React.PropTypes.shape({
        name: React.PropTypes.string,
        beginYear: React.PropTypes.number,
        endYear: React.PropTypes.number
      })
    ),
    types: React.PropTypes.arrayOf(
      React.PropTypes.shape({
        type: React.PropTypes.shape({
          name: React.PropTypes.string
        }),
        beginYear: React.PropTypes.number,
        endYear: React.PropTypes.number
      })
    )
  })
};

export default SchoolDetails;
