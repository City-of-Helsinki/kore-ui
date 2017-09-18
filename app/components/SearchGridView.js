'use strict';

import _ from 'lodash';
import React from 'react';
import Loader from 'react-loader';
import {Link} from 'react-router';

import InfoRow from './InfoRow';
import SearchLoadMore from './SearchLoadMore';
import {getLinkProps} from '../core/utils';

function getInfoRow(row) {
  delete row.boxContent;
  return <InfoRow {...row}/>;
}

function processGridInfoRow(details) {
  if (_.isEmpty(details.name)) {
    return [];
  }
  let items = [
    {
      key: 'school-name-' + details.name.id,
      className: 'details-school-name',
      name: details.name
    }
  ];
  if (details.type === 'principal') {
    items.push({
      key: 'principal-' + details.id,
      className: 'details-principal',
      name: details.extraInfo
    });
  }
  if (details.type === 'building') {
    items.push({
      key: 'building-' + details.id,
      className: 'details-location',
      name: details.extraInfo
    });
  }
  items.push({
    key: 'years-for-' + details.id,
    className: 'details-years',
    name: [
      details.beginYear,
      <i className='fa fa-lg fa-long-arrow-right'/>,
      details.endYear
    ]
  });
  return items;
}

function processSchool(school) {
  const schoolImageStyles = {
    backgroundImage: 'url(' + school.imageUrl + ')'
  };
  const linkProps = getLinkProps(school);
  return (
    <div className='school-grid-wrapper'>
      <Link {...linkProps}>
        <div className='school-grid'>
          <div className='school-image' style={schoolImageStyles}></div>
          <ol className='school-grid-details-list'>
            {processGridInfoRow(school).map(getInfoRow)}
          </ol>
        </div>
      </Link>
    </div>
  );
}

function getSchoolRow(schools) {
  return (
    <div className='school-grid-row'>
      {schools.map(processSchool)}
    </div>
  );
}

class SearchGridView extends React.Component {
  renderSearchResults() {
    if (this.props.schoolList.length) {
      const chunkedSchools = _.chunk(this.props.schoolList, 3);
      return (
        <div className='search-grid'>
          {chunkedSchools.map(getSchoolRow)}
        </div>
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

SearchGridView.propTypes = {
  fetchingData: React.PropTypes.bool,
  nextPagesUrlDict: React.PropTypes.objectOf(React.PropTypes.string),
  schoolList: React.PropTypes.array.isRequired,
  somethingWasSearched: React.PropTypes.bool.isRequired
};

export default SearchGridView;
