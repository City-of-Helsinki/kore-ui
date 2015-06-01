'use strict';

import React from 'react';
import DocumentTitle from 'react-document-title';
import SchoolActionCreators from '../actions/SchoolActionCreators';
import SchoolDetails from '../components/SchoolDetails';
import SchoolImage from '../components/SchoolImage';
import SchoolMap from '../components/SchoolMap';
import SchoolTimelineInfo from '../components/SchoolTimelineInfo';
import SchoolTitle from '../components/SchoolTitle';
import SchoolStore from '../stores/SchoolStore';
import UIStore from '../stores/UIStore';

function parseSchoolId(props) {
  return parseInt(props.params.schoolId);
}

function getStateFromStores(schoolId) {
  const selectedYear = UIStore.getSchoolTimelineYear();
  return {
    fetchingData: SchoolStore.getFetchingData(),
    mainName: SchoolStore.getMainName(schoolId),
    yearsActive: SchoolStore.getBeginAndEndYear(schoolId),
    buildingInSelectedYear: SchoolStore.getBuildingForYear(schoolId, selectedYear),
    schoolDetails: SchoolStore.getSchoolDetails(schoolId),
    schoolYearDetails: SchoolStore.getSchoolYearDetails(
      schoolId,
      selectedYear
    ),
    locationForSelectedYear: SchoolStore.getLocationForYear(schoolId, selectedYear),
    currentYear: selectedYear
  };
}

class SchoolPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = getStateFromStores(parseSchoolId(props));
    this.schoolDidChange = this.schoolDidChange.bind(this);
    this._onChange = this._onChange.bind(this);
  }

  componentWillMount() {
    SchoolStore.addChangeListener(this._onChange);
    UIStore.addChangeListener(this._onChange);
  }

  componentDidMount() {
    this.schoolDidChange(this.props.params.schoolId);
  }

  componentWillUnmount() {
    SchoolStore.removeChangeListener(this._onChange);
    UIStore.removeChangeListener(this._onChange);
  }

  componentWillReceiveProps(nextProps) {
    if (parseSchoolId(nextProps) !== parseSchoolId(this.props)) {
      this.schoolDidChange(parseSchoolId(nextProps));
    }
  }

  schoolDidChange(schoolId) {
    SchoolActionCreators.requestSchool(schoolId);
  }

  _onChange() {
    this.setState(getStateFromStores(parseSchoolId(this.props)));
  }

  render() {
    return (
      <DocumentTitle title='Koulut - Koulurekisteri'>
        <div className='school-page'>
          <SchoolTitle name={this.state.mainName} />
          <SchoolTimelineInfo
            currentYear={this.state.currentYear}
            schoolYearDetails={this.state.schoolYearDetails}
            yearsActive={this.state.yearsActive}
          />
          <div className='container'>
            <div className='school-image-map'>
              <SchoolImage
                building={this.state.buildingInSelectedYear}
                fetchingData={this.state.fetchingData}
              />
              <div className='school-map'>
                <SchoolMap
                  fetchingData={this.state.fetchingData}
                  location={this.state.locationForSelectedYear}
                />
              </div>
            </div>
          </div>
          <SchoolDetails details={this.state.schoolDetails} />
        </div>
      </DocumentTitle>
    );
  }
}

SchoolPage.propTypes = {
  params: React.PropTypes.shape({
    schoolId: React.PropTypes.string.isRequired
  }).isRequired
};

export default SchoolPage;
