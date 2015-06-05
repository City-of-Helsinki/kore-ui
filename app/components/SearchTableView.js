'use strict';

import _ from 'lodash';
import React from 'react';
import Loader from 'react-loader';
import {Link} from 'react-router';

import SearchLoadMore from './SearchLoadMore';

class SearchTableView extends React.Component {

  getTableRow(school, extra) {
    return (
      <tr key={school.id}>
        <td>
          <Link params={{schoolId: school.id}} to='school'>{school.name.officialName}</Link>
        </td>
        <td>{extra}</td>
      </tr>
    );
  }

  getTableRows() {
    const schoolList = _.map(_.flatten(this.props.schoolList, true), (school) => {
      return (
        this.getTableRow(school)
      );
    });
    const principalList = _.map(_.flatten(this.props.principalList, true), (school) => {
      return (
        this.getTableRow(
          school,
          <div className='principalTableResult'>{school.principal.name}</div>
        )
      );
    });
    const schoolBuildingList = _.map(_.flatten(this.props.schoolBuildingList, true), (school) => {
      return (
        this.getTableRow(
          school,
          <div className='addressTableResult'>{school.address}</div>
        )
      );
    });

    return schoolList.concat(principalList, schoolBuildingList);
  }

  renderSearchResults() {
    if (this.props.schoolList.length) {
      return (
        <table className='table table-striped'>
          <thead>
            <tr>
              <th>Koulu</th>
              <th>Lisätiedot</th>
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
  principalList: React.PropTypes.array.isRequired,
  schoolBuildingList: React.PropTypes.array.isRequired,
  schoolList: React.PropTypes.array.isRequired,
  somethingWasSearched: React.PropTypes.bool.isRequired
};

export default SearchTableView;
