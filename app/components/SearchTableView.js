'use strict';

import _ from 'lodash';
import React from 'react';
import Loader from 'react-loader';
import {Link} from 'react-router';

import SearchLoadMore from './SearchLoadMore';

class SearchTableView extends React.Component {

  getTableRows() {
    return this.props.schoolList.map(function(school) {
      return (
        <tr key={school.id}>
          <td>
            <Link params={{schoolId: school.id}} to='school'>{school.name.officialName}</Link>
          </td>
          <td>{school.address}</td>
        </tr>
      );
    });
  }

  renderSearchResults() {
    if (this.props.schoolList.length) {
      return (
        <table className='table table-striped'>
          <thead>
            <tr>
              <th>Koulu</th>
              <th>Osoite</th>
            </tr>
          </thead>
          <tbody>
            {this.getTableRows()}
          </tbody>
        </table>
      );
    } else {
      return <p>Yhtään hakutulosta ei löytynyt.</p>;
    }
  }

  render() {
    return <div></div>;  // This line is only to avoid javascript errors in the current APP state.
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

SearchTableView.propTypes = {
  fetchingData: React.PropTypes.bool,
  nextPagesUrlDict: React.PropTypes.objectOf(React.PropTypes.string),
  schoolList: React.PropTypes.array.isRequired,
  somethingWasSearched: React.PropTypes.bool.isRequired
};

export default SearchTableView;
