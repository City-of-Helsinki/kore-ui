'use strict';

import _ from 'lodash';
import React from 'react';
import Timeline from './Timeline';
import InfoRow from './InfoRow';
import {getAddressArrayFromBuilding} from '../core/utils';

function getInfoRow(row) {
  return <InfoRow {...row}/>;
}

function processRow(details) {
  if (_.isEmpty(details.schoolName)) {
    return [];
  }
  return [
    {
      key: 'school-name',
      className: 'details-school-name',
      name: details.schoolName.official_name,
      boxContent: [
        details.schoolName.begin_year,
        <i className='fa fa-lg fa-long-arrow-right'/>,
        details.schoolName.end_year
      ]
    },
    {
      key: 'headmaster',
      className: 'details-headmaster',
      name: 'headmaster',  // details.headmaster.name
      boxContent: 'rehtori'
    },
    {
      key: 'school-building',
      className: 'details-building',
      // The address should be sorted by time as well.
      name: getAddressArrayFromBuilding(details.building.building),
      boxContent: 'sijainti'
    },
    {
      key: 'school-archive',
      className: 'details-archive',
      name: details.archive.location,
      boxContent: [
        details.archive.begin_year,
        <i className='fa fa-lg fa-long-arrow-right'/>,
        details.archive.end_year
      ]
    }
  ];
}

class SchoolTimelineInfo extends React.Component {

  render() {
    return (
      <div className='school-timeline-info-wrapper'>
        <div className='container'>
          <div className='school-timeline-info'>
            <Timeline yearsActive={this.props.yearsActive} currentYear={this.props.currentYear}/>
            <div className='school-year-info'>
              <ol className='school-year-details-list'>
                {processRow(this.props.schoolYearDetails).map(getInfoRow)}
              </ol>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

SchoolTimelineInfo.propTypes = {
  yearsActive: React.PropTypes.shape({
    'beginYear': React.PropTypes.number,
    'endYear': React.PropTypes.number
  }),
  currentYear: React.PropTypes.number,
  schoolYearDetails: React.PropTypes.shape({
    'schoolName': React.PropTypes.shape({
      'official_name': React.PropTypes.string,
      'begin_year': React.PropTypes.number,
      'end_year': React.PropTypes.number
    }),
    'building': React.PropTypes.shape({
      addresses: React.PropTypes.arrayOf(
        React.PropTypes.shape({
          'street_name_fi': React.PropTypes.string,
          'municipality_fi': React.PropTypes.string
        })
      )
    })
  })
};

export default SchoolTimelineInfo;
