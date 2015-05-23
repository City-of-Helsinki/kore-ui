'use strict';

import _ from 'lodash';
import React from 'react';
import InfoTable from './InfoTable';
import {getAddressArrayFromBuilding} from '../core/utils';

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
        name: getAddressArrayFromBuilding(building.building),
        boxContent: getBoxContent(building),
        items: [
          {
            key: 'neighborhood-of-building-' + building.id,
            name: building.building.neighborhood,
            boxContent: 'alue'
          },
          {
            key: 'architect-of-building-' + building.id,
            name: building.building.architect,
            boxContent: 'arkkitehti'
          }
        ]
      };
    });
  },
  names: function(names) {
    return _.map(names, function(name) {
      return {
        key: 'school-name-' + name.id,
        className: 'details-school-name',
        name: name.official_name,
        boxContent: getBoxContent(name)
      };
    });
  }
};

function getBoxContent(item) {
  return [
    item.begin_year,
    <i className='fa fa-lg fa-long-arrow-right'/>,
    item.end_year
  ];
}

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
        </section>
      </div>
    );
  }
}

SchoolDetails.propTypes = {
  details: React.PropTypes.shape({
    archives: React.PropTypes.arrayOf(
      React.PropTypes.shape({
        'location': React.PropTypes.string,
        'begin_year': React.PropTypes.number,
        'end_year': React.PropTypes.number
      })
    ),
    buildings: React.PropTypes.arrayOf(
      React.PropTypes.shape({
        'begin_year': React.PropTypes.number,
        'end_year': React.PropTypes.number,
        building: React.PropTypes.shape({
          neighborhood: React.PropTypes.string,
          architect: React.PropTypes.string,
          addresses: React.PropTypes.arrayOf(
            React.PropTypes.shape({
              'street_name_fi': React.PropTypes.string,
              'municipality_fi': React.PropTypes.string
            })
          )
        })
      })
    ),
    names: React.PropTypes.arrayOf(
      React.PropTypes.shape({
        'official_name': React.PropTypes.string,
        'begin_year': React.PropTypes.number,
        'end_year': React.PropTypes.number
      })
    )
  })
};

export default SchoolDetails;
