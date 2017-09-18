'use strict';

import _ from 'lodash';
import React from 'react';
import Loader from 'react-loader';

import InfoRow from './InfoRow';
import Timeline from './Timeline';

function getInfoRow(row) {
  return <InfoRow {...row}/>;
}

function processInfoRow(details) {
  if (_.isEmpty(details.name)) {
    return [];
  }
  return [
    {
      key: 'timeline-principal-info',
      className: 'details-principal',
      name: details.principalString
    },
    {
      key: 'timeline-building-info',
      className: 'details-location',
      name: details.buildingString
    },
    {
      key: 'timeline-archive-info',
      className: 'details-archive',
      name: details.archiveArray
    },
    {
      key: 'timeline-type-info',
      className: 'details-building',
      name: details.typeString
    },
    {
      key: 'timeline-language-info',
      className: 'details-language',
      name: details.languageString
    },
    {
      key: 'timeline-gender-info',
      className: 'details-gender',
      name: details.genderString
    }
  ];
}

class SchoolTimelineInfo extends React.Component {

  renderYearInfoHeader() {
    let headerText = '';
    if (this.props.schoolYearDetails && this.props.schoolYearDetails.name) {
      headerText = `
        ${this.props.schoolYearDetails.name.officialName} vuonna ${this.props.selectedYear}
      `;
    }
    return <h2>{headerText}</h2>;
  }

  render() {
    const loadingTimeline = _.isEmpty(this.props.yearsActive);
    return (
      <div className='school-timeline-info-wrapper'>
        <div className='container'>
          <div className='school-timeline-info'>
            <div className='school-timeline-container'>
              <Loader color='#FFF' loaded={!loadingTimeline}>
                <Timeline
                  selectedYear={this.props.selectedYear}
                  yearsActive={this.props.yearsActive}
                />
              </Loader>
            </div>
            <div className='school-year-info'>
              {this.renderYearInfoHeader()}
              <ol className='school-year-details-list'>
                {processInfoRow(this.props.schoolYearDetails).map(getInfoRow)}
              </ol>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

SchoolTimelineInfo.propTypes = {
  schoolYearDetails: React.PropTypes.shape({
    archiveArray: React.PropTypes.array,
    buildingString: React.PropTypes.string,
    genderString: React.PropTypes.string,
    languageString: React.PropTypes.string,
    name: React.PropTypes.object,
    principalString: React.PropTypes.string,
    typeString: React.PropTypes.string
  }),
  selectedYear: React.PropTypes.number,
  yearsActive: React.PropTypes.shape({
    beginYear: React.PropTypes.number,
    endYear: React.PropTypes.number
  })
};

export default SchoolTimelineInfo;
