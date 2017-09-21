import React, { Component } from 'react';
// import { connect } from 'react-redux';
// import { withRouter} from 'react-router-dom';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';

export class MapContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.style = {
      width: '1075px',
      height: '600px'
    };

    // binding this to event-handler functions
    this.onMarkerClick = this.onMarkerClick.bind(this);
    this.onMapClicked = this.onMapClicked.bind(this);
  }

  onMarkerClick(props, marker, e) {
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });
  }

  onMapClicked(props) {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      })
    }
  }

  render() {
    const {name, long, lat, icon} = this.props;
      return (
        <Map
          google={this.props.google}
          style = {this.style}
          initialCenter={{
            lat: lat,
            lng: long,
          }}
          zoom={12}
          onClick={this.onMapClicked}>
          <Marker
            position={{lat: lat, lng: long}}
            onClick={this.onMarkerClick}
            name={'Current location'} icon = { icon } />
          <InfoWindow
            marker={this.state.activeMarker}
            visible={this.state.showingInfoWindow}>
              <div>
                <h1>{name}</h1>
              </div>
          </InfoWindow>
        </Map>
      );
    }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyBlX2BNCqWGltLM-vDuyHA_NNnWNgjcp10'
})(MapContainer);
