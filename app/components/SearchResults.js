'use strict';

import React from 'react';
import SearchGridView from './SearchGridView';
import SearchTableView from './SearchTableView';
import SearchMapView from './SearchMapView';

const views = {
  map: SearchMapView,
  table: SearchTableView,
  grid: SearchGridView
};

class SearchResults extends React.Component {
  render() {
    const View = views[this.props.view];
    return (
      <div className='container'>
        <View
          fetchingData={this.props.fetchingData}
          schoolList={this.props.schoolList}
          somethingWasSearched={this.props.somethingWasSearched}
        />
      </div>
    );
  }
}

SearchResults.propTypes = {
  fetchingData: React.PropTypes.bool,
  schoolList: React.PropTypes.array.isRequired,
  somethingWasSearched: React.PropTypes.bool.isRequired,
  view: React.PropTypes.string.isRequired
};

export default SearchResults;
