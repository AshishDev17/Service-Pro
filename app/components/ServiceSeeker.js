'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import MapContainer from './MapContainer';
import {geolocated, geoPropTypes} from 'react-geolocated';
import { Header, Divider, Button, Message} from 'semantic-ui-react';
import socket from '../socket';


class Seeker extends Component {
  constructor(props){
    super(props);
    this.state ={
      seekerDetails: {},
      provider: {},
      serviceProviders: [],
    };
    this.styles = {
      message: {
        width: '1075px',
        height: '70px',
      },
    };
    this.handleRequest = this.handleRequest.bind(this);
  }

  componentDidMount(){
    socket.emit('join', this.props.seeker);
    socket.on('service-request', (providers) => {
      this.setState({
        serviceProviders: providers
      });
    });
    socket.on('request-accepted', (providerDetails) => {
      this.setState({
        provider: providerDetails,
        serviceProviders: [providerDetails],
      });
    });
     socket.on('request-complete', (data) => {
      this.setState({
        provider: {},
        serviceProviders: [],
      });
    });
  }

  handleRequest (e, seeker) {
    this.setState({
        seekerDetails: seeker,
      });
    socket.emit('service-request', seeker);
  }

  render () {
    const styles = this.styles;
    const {seeker} = this.props;
    const {provider, seekerDetails, serviceProviders} = this.state;

    const locationMarkers = [];
    if ( serviceProviders.length > 0){
      serviceProviders.forEach(prvdr => {
        locationMarkers.push({
          name: prvdr.name,
          icon: prvdr.icon,
          coordinates: prvdr.location.coordinates,
        });
      });
      locationMarkers.push({
        name: seekerDetails.name,
        icon: seekerDetails.icon,
        coordinates: seekerDetails.location.coordinates,
      });
    }

    return (
      <div>
        {
          seeker.id &&
          <div>
            <Header as = 'h1'>Hello {seeker.name}</Header>
            <Divider hidden />
              {
                !this.props.isGeolocationAvailable
                ? <div>Your browser does not support Geolocation</div>
                : !this.props.isGeolocationEnabled
                ? <div>Geolocation is not enabled</div>
                : this.props.coords
                ?<div>
                  <Message positive style = {styles.message}>
                    <Message.Header>Your Location</Message.Header>
                    <p>Latutude: {this.props.coords.latitude} & Longitude: {this.props.coords.longitude}</p>
                  </Message>
                  <Divider hidden />
                  {
                    !provider.id
                    &&
                    <div>
                      <Button onClick={(e) => this.handleRequest(e, Object.assign({}, seeker, {location: { coordinates: [this.props.coords.longitude, this.props.coords.latitude]}}))} color = 'blue' positive >Request Service</Button>
                      <Divider hidden />
                    </div>
                  }
                  { provider.id &&
                    <div>
                      <Message positive style = {styles.message}>
                        <Message.Header>
                          Service Request Status
                        </Message.Header>
                        <p>
                          {'Service provider ' + provider.name + ' has accepted your service request'}
                        </p>
                      </Message>
                    <Divider hidden />
                    </div>
                  }
                  <MapContainer markers = { locationMarkers } lat={this.props.coords.latitude} long={this.props.coords.longitude} icon={seeker.icon}/>
                </div>
                : <div>Getting the location data&hellip; </div>
              }
          </div>
        }
        </div>
    )
  }
}

Seeker.propTypes = Object.assign({}, Seeker.propTypes, geoPropTypes);

const ServiceSeeker = geolocated({
  positionOptions: {
    enableHighAccuracy: true,
  },
  userDecisionTimeout: 5000,
})(Seeker);

// const mapState = (state) => {
//   return {};
// };

// const mapDispatch = (dispatch) => {
//   return {};
// };

export default withRouter(connect(null, null)(ServiceSeeker));

