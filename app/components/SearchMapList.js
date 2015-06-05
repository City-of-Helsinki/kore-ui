'use strict';

import _ from 'lodash';
import React from 'react';
import Loader from 'react-loader';

import SearchLoadMore from './SearchLoadMore';
import SearchMapListItem from './SearchMapListItem';

class SearchMapList extends React.Component {
  constructor() {
    super();
    this.getListItem = this.getListItem.bind(this);
  }

  getListItem(school) {
    return (
      <SearchMapListItem
        key={school.id}
        school={school}
        selectedSchool={this.props.selectedSchool}
      />
    );
  }

  renderSearchResults() {
    if (this.props.schoolList.length) {
      return (
        <ul>
          {this.props.schoolList.map(this.getListItem)}
        </ul>
      );
    } else {
      return <p>Yhtään hakutulosta ei löytynyt.</p>;
    }
  }

  render() {
    const loading = this.props.fetchingData && (this.props.schoolList.length === 0);
    let loadMore;
    if (!_.isEmpty(this.props.nextPagesUrlDict)) {
      loadMore = (
        <SearchLoadMore
          fetchingData={this.props.fetchingData}
          urls={this.props.nextPagesUrlDict}
        />
      );
    }
    if (this.props.somethingWasSearched) {
      return (
        <Loader loaded={!loading}>
          {this.renderSearchResults()}
          {loadMore}
        </Loader>
      );
    }
    return <p>Etsi kouluja syöttämällä koulun nimi tai osoite yllä olevaan hakukenttään.</p>;
  }
}

SearchMapList.propTypes = {
  fetchingData: React.PropTypes.bool,
  nextPagesUrlDict: React.PropTypes.objectOf(React.PropTypes.string),
  schoolList: React.PropTypes.array.isRequired,
  selectedSchool: React.PropTypes.number,
  somethingWasSearched: React.PropTypes.bool.isRequired
};

export default SearchMapList;
