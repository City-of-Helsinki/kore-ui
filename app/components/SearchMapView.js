'use strict';

import _ from 'lodash';
import React from 'react';

import SearchMap from './SearchMap';
import SearchMapList from './SearchMapList';
import SearchMapYearControl from './SearchMapYearControl';
import {getFilterPropType} from '../core/utils';

function getSchoolsWithLocation(schools) {
  return _.filter(schools, function(school) {
    return !_.isEmpty(school.location.coordinates);
  });
}

class SearchMapView extends React.Component {
  render() {
    const schoolsWithLocation = getSchoolsWithLocation(this.props.schoolList);
    return (
      <div className='search-map-view'>
        <SearchMapYearControl
          filters={this.props.filters}
          searchQuery={this.props.searchQuery}
          selectedMapYear={String(this.props.selectedMapYear)}
          years={this.props.years}
        />
        <div className='search-map-container' id='map-map'>
          <SearchMap
            fetchingData={this.props.fetchingData}
            schoolList={schoolsWithLocation}
            selectedMapYear={this.props.selectedMapYear}
            selectedSchool={this.props.selectedSchool}
          />
        </div>
        <div className='search-map-list-container'>
          <SearchMapList
            fetchingData={this.props.fetchingData}
            nextPagesUrlDict={this.props.nextPagesUrlDict}
            schoolList={schoolsWithLocation}
            selectedSchool={this.props.selectedSchool}
            somethingWasSearched={this.props.somethingWasSearched}
          />
        </div>
      </div>
    );
  }
}

const filterPropType = getFilterPropType();

SearchMapView.propTypes = {
  fetchingData: React.PropTypes.bool,
  filters: React.PropTypes.shape({
    type: filterPropType,
    field: filterPropType,
    language: filterPropType,
    gender: filterPropType
  }),
  nextPagesUrlDict: React.PropTypes.objectOf(React.PropTypes.string),
  schoolList: React.PropTypes.array.isRequired,
  searchQuery: React.PropTypes.string.isRequired,
  selectedMapYear: React.PropTypes.number,
  selectedSchool: React.PropTypes.number,
  somethingWasSearched: React.PropTypes.bool.isRequired,
  years: React.PropTypes.arrayOf(React.PropTypes.number)
};

export default SearchMapView;
