'use strict';

import _ from 'lodash';
import React from 'react';
import Loader from 'react-loader';
import {Link} from 'react-router';

import SearchLoadMore from './SearchLoadMore';
import {getLinkProps} from '../core/utils';

class SearchTableView extends React.Component {

  getSchoolLink(result) {
    const linkProps = getLinkProps(result);
    return (
      <Link {...linkProps}>{result.name}</Link>
    );
  }

  getTableRow(result) {
    const extraInfoClassName = result.extraInfo ? 'with-icon ' + result.type : '';
    return (
      <tr key={result.id}>
        <td className='with-icon school-name'>
          {this.getSchoolLink(result)}
        </td>
        <td className={extraInfoClassName}>{result.extraInfo}</td>
        <td>
          {result.beginYear}
          <i className='fa fa-lg fa-long-arrow-right'/>
          {result.endYear}
        </td>
      </tr>
    );
  }

  getTableRows() {
    return _.map(
      this.props.schoolList, (result) => this.getTableRow(result)
    );
  }

  renderSearchResults() {
    if (this.props.schoolList.length) {
      return (
        <table className='table table-striped search-table'>
          <thead>
            <tr>
              <th>Koulu</th>
              <th>Lisätiedot</th>
              <th>Vuodet</th>
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
    let infoText;
    if (!_.isEmpty(this.props.nextPagesUrlDict)) {
      loadMore = (
        <SearchLoadMore
          fetchingData={this.props.fetchingData}
          urls={this.props.nextPagesUrlDict}
        />
      );
    }
    if (this.props.infoText) {
      infoText = <p>{this.props.infoText}</p>;
    }
    if (this.props.somethingWasSearched) {
      return (
        <Loader loaded={!loading}>
          {infoText}
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
  infoText: React.PropTypes.string,
  nextPagesUrlDict: React.PropTypes.objectOf(React.PropTypes.string),
  schoolList: React.PropTypes.array.isRequired,
  somethingWasSearched: React.PropTypes.bool.isRequired
};

export default SearchTableView;
