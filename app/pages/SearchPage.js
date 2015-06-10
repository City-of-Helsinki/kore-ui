'use strict';

import React from 'react';
import DocumentTitle from 'react-document-title';

import SearchBox from '../components/SearchBox';
import SearchControls from '../components/SearchControls';
import SearchGridView from '../components/SearchGridView';
import SearchTableView from '../components/SearchTableView';
import SearchTimeline from '../components/SearchTimeline';
import EmployershipStore from '../stores/EmployershipStore';
import SchoolBuildingStore from '../stores/SchoolBuildingStore';
import SchoolStore from '../stores/SchoolStore';
import SearchStore from '../stores/SearchStore';

function getStateFromStores() {
  const searchResults = SearchStore.getSearchResults();
  const searchQuery = SearchStore.getSearchQuery();

  return {
    buildingResults: SchoolBuildingStore.getSearchDetails(searchResults.buildings),
    fetchingData: SearchStore.getFetchingData(),
    filters: SearchStore.getFilters(),
    filtersOptions: SearchStore.getFiltersOptions(),
    infoText: SearchStore.getInfoText(),
    nameResults: SchoolStore.getSearchDetails(searchResults.schools, searchQuery),
    nextPagesUrlDict: SearchStore.getNextPagesUrlDict(),
    principalResults: EmployershipStore.getSearchDetails(searchResults.employerships),
    searchQuery: SearchStore.getSearchQuery(),
    selectedMapYear: SearchStore.getSelectedMapYear(),
    selectedSchoolId: SearchStore.getSelectedSchoolId(),
    somethingWasSearched: SearchStore.getSomethingWasSearched(),
    view: SearchStore.getView(),
    years: SearchStore.getYears()
  };
}

class SearchPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = getStateFromStores();
    this._onChange = this._onChange.bind(this);
  }

  componentWillMount() {
    SearchStore.addChangeListener(this._onChange);
    SchoolStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    SearchStore.removeChangeListener(this._onChange);
    SchoolStore.removeChangeListener(this._onChange);
  }

  renderSearchResultsView() {
    const schoolList = this.state.nameResults.concat(
      this.state.buildingResults, this.state.principalResults
    );

    const searchViewProps = {
      fetchingData: this.state.fetchingData,
      infoText: this.state.infoText,
      nextPagesUrlDict: this.state.nextPagesUrlDict,
      schoolList: schoolList,
      somethingWasSearched: this.state.somethingWasSearched
    };

    if (this.state.view === 'grid') {
      return <SearchGridView {...searchViewProps} />;
    }

    if (this.state.view === 'table') {
      return <SearchTableView {...searchViewProps} />;
    }

    return null;
  }

  render() {
    return (
      <DocumentTitle title='Etsi koulua - Koulurekisteri'>
        <div className='search-page'>
          <header className='container'>
            <h1 className='search-title' >
              <img alt='Helsingin vaakuna' src={require('../images/Helsinki.vaakuna.svg')} />
              Haku
            </h1>
          </header>
          <SearchBox
            filters={this.state.filters}
            searchQuery={this.state.searchQuery}
            years={this.state.years}
          />
          <SearchControls
            filters={this.state.filters}
            filtersOptions={this.state.filtersOptions}
            view={this.state.view}
          />
          <div className='container'>
            <SearchTimeline years={this.state.years} />
          </div>
          <div className='container'>
            <div className='search-results'>
              {this.renderSearchResultsView()}
            </div>
          </div>
        </div>
      </DocumentTitle>
    );
  }

  _onChange() {
    this.setState(getStateFromStores());
  }
}

export default SearchPage;
