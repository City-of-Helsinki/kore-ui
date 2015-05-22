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
    mainBuildingInSelectedYear: SchoolStore.getMainBuildingInYear(schoolId, selectedYear),
    schoolDetails: SchoolStore.getSchoolDetails(schoolId),
    schoolYearDetails: SchoolStore.getSchoolYearDetails(
      schoolId,
      selectedYear
    ),
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
          <SchoolTitle name={this.state.mainName} yearsActive={this.state.yearsActive} />
          <SchoolTimelineInfo
            yearsActive={this.state.yearsActive}
            currentYear={this.state.currentYear}
            schoolYearDetails={this.state.schoolYearDetails}
          />
          <div className='container'>
            <div className='school-image-map'>
              <SchoolImage
                fetchingData={this.state.fetchingData}
                building={this.state.mainBuildingInSelectedYear}
              />
              <SchoolMap />
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
