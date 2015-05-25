'use strict';

import React from 'react';
import {Map, Marker, Popup, TileLayer} from 'react-leaflet';
import Loader from 'react-loader';
import _ from 'lodash';

class SchoolMap extends React.Component {
  getPosition() {
    if (_.isEmpty(this.props.location)) {
      return null;
    }
    const coordinates = this.props.location.coordinates;
    return [coordinates[1], coordinates[0]];
  }

  render() {
    const position = this.getPosition();
    const zoom = this.props.zoom || 14;
    const address = this.props.location.address || '';
    return (
      <Loader loaded={!_.isEmpty(position)} color='#FFF'>
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
      </Loader>
    );
  }
}

SchoolMap.propTypes = {
  location: React.PropTypes.shape({
    address: React.PropTypes.string,
    coordinates: React.PropTypes.array,
    type: React.PropTypes.string
  }).isRequired,
  zoom: React.PropTypes.number
};

export default SchoolMap;
