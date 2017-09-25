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
      height: '500px'
    };

    // binding this to event-handler functions
    this.onMarkerClick = this.onMarkerClick.bind(this);
    this.onMapClicked = this.onMapClicked.bind(this);
  }

  onMarkerClick(props, marker, e) {
    this.setState({
      name: marker.label,
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });
    console.log('marker clicked', marker);
  }

  onMapClicked(props) {
    if (this.state.showingInfoWindow) {
      this.setState({
        name: '',
        showingInfoWindow: false,
        activeMarker: null
      });
    }
  }

  render() {
    //const {name, long, lat, icon} = this.props;
    const {markers, long, lat, icon} = this.props;
      return (
        <Map
          google={this.props.google}
          style = {this.style}
          initialCenter={{
            lat: lat,
            lng: long,
          }}
          zoom={9}
          onClick={this.onMapClicked}>
          {
            markers.length > 0
            ?markers.map((marker, index) => {
              return <Marker key={index} label={marker.name}
            position={{lat: marker.coordinates[1], lng: marker.coordinates[0]}}
            onClick={this.onMarkerClick}
            icon = { marker.icon } />
          })
          :<Marker position={{lat: lat, lng: long}}
            onClick={this.onMarkerClick}
            icon = { icon } />
          }
          <InfoWindow
            marker={this.state.activeMarker}
            visible={this.state.showingInfoWindow}>
            <div>
              <h2>{this.state.name}</h2>
            </div>
          </InfoWindow>
        </Map>
      );
    }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyBlX2BNCqWGltLM-vDuyHA_NNnWNgjcp10'
})(MapContainer);

{/*
  <InfoWindow
            marker={this.state.activeMarker}
            visible={this.state.showingInfoWindow}>
          </InfoWindow>
*/}
