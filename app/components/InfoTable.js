'use strict';

import React from 'react';
import InfoRow from './InfoRow';

function getInfoRow(item) {
  return <InfoRow {...item}/>;
}

function getInitialState() {
  return {
    expanded: false
  };
}

const unexpandedListSize = 6;

class InfoTable extends React.Component {

  constructor(props) {
    super(props);
    this.state = getInitialState();
    this.handleExpandClick = this.handleExpandClick.bind(this);
  }

  handleExpandClick() {
    this.setState({
      expanded: !this.state.expanded
    });
  }

  getExpandButton() {
    if ((this.props.items.length > unexpandedListSize) && this.props.expandable) {
      let content;
      if (this.state.expanded) {
        content = ['View less ', <i className='fa fa-lg fa-chevron-up'/>];
      } else {
        content = ['View more ', <i className='fa fa-lg fa-chevron-down'/>];
      }
      return (
        <button className='button-expand' onClick={this.handleExpandClick}>
          {content}
        </button>
      );
    }
    return [];
  }

  getFilteredItems(items) {
    if (!this.props.expandable) {
      return items;
    }
    if (unexpandedListSize > items.length) {
      return items;
    }
    if (this.state.expanded) {
      return items;
    }
    return items.slice(0, unexpandedListSize);
  }

  getItemsByColumn() {
    const items = this.getFilteredItems(this.props.items);
    let halfLength = Math.ceil(items.length / 2);
    return [items.slice(0, halfLength), items.slice(halfLength)];
  }

  render() {
    if (!this.props.items.length) {
      return null;
    }
    let itemsColumnOne;
    let itemsColumnTwo;
    [itemsColumnOne, itemsColumnTwo] = this.getItemsByColumn();
    return (
      <section className='info-table'>
        <header>
          <h2>{this.props.title}</h2>
        </header>
        <div className='info-table-columns'>
          <ol className='column column-one'>
            {itemsColumnOne.map(getInfoRow)}
          </ol>
          <ol className='column column-two'>
            {itemsColumnTwo.map(getInfoRow)}
          </ol>
        </div>
        {this.getExpandButton()}
      </section>
    );
  }
}

InfoTable.propTypes = {
  title: React.PropTypes.string.isRequired,
  items: React.PropTypes.array.isRequired,
  expandable: React.PropTypes.bool.isRequired
};

export default InfoTable;
