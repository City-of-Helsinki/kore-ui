'use strict';

import React from 'react';
import {Map, Marker, Popup, TileLayer} from 'react-leaflet';
import Loader from 'react-loader';
import _ from 'lodash';

class SchoolMap extends React.Component {
  getPosition() {
    const coordinates = this.props.location.coordinates;
    if (_.isEmpty(coordinates)) {
      return null;
    }
    return [coordinates[1], coordinates[0]];
  }

  renderMap() {
    const position = this.getPosition();
    const zoom = this.props.zoom || 14;
    const address = this.props.location.address || '';
    if (!_.isEmpty(position)) {
      return (
        <Map center={position} zoom={zoom}>
          <TileLayer
            url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={position}>
            <Popup>
              <span>{address}</span>
            </Popup>
          </Marker>
        </Map>
      );
    } else {
      return (
        <div className='location-undefined-message'>
          <i className='fa fa-map-marker'></i>
          Sijaintia tälle vuodelle ei ole määritelty.
        </div>
      );
    }
  }

  render() {
    return (
      <Loader loaded={!this.props.fetchingData} color='#FFF'>
        {this.renderMap()}
      </Loader>
    );
  }
}

SchoolMap.propTypes = {
  fetchingData: React.PropTypes.bool,
  location: React.PropTypes.shape({
    address: React.PropTypes.string,
    coordinates: React.PropTypes.array,
    type: React.PropTypes.string
  }).isRequired,
  zoom: React.PropTypes.number
};

export default SchoolMap;
