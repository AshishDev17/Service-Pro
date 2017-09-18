'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, NavLink } from 'react-router-dom';
import ReactMapboxGl, { Marker, Layer, Feature } from "react-mapbox-gl";
import socket from '../socket';

export default class Seeker extends Component {
  constructor(props){
    super(props);
    this.state ={
      seekerDetails: {},
      providerDetails: {}
    }
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount(){
    const seekerId = this.props.match.params.seekerId;
    const seekerDetails = {
      seekerId: seekerId,
      location: {
        longitude: -87.618393,
        latitude: 41.862403
      }
    };
    //setting the state with fake data
    this.setState({
      seekerDetails: seekerDetails
    });

    socket.emit('join', {seekerId: seekerId});
    socket.on('request-accepted', (providerDetails) => {
      this.setState({
        providerDetails: providerDetails
      });
    })
  }

  handleClick (e) {
    socket.emit('service-request', this.state.seekerDetails)
  }

  render () {
    const seeker = this.state.seekerDetails;
    const provider = this.state.providerDetails;
    const Map = ReactMapboxGl({
      accessToken: "pk.eyJ1IjoiY29kZXIyMDE3IiwiYSI6ImNqN2FlNmI0ejBlOXcycW4wN2dkdHM0N2MifQ.NrK0rawJ0fJ4uGOna-cBaw"
    });
    console.log('seeker', seeker);
    console.log('provider', provider);

    return (
      <div>
        <h1>Hello Citizen {seeker.seekerId}</h1>
        <div>
          <button onClick={this.handleClick}>Request Service</button>
        </div>
        {provider.id
          ? <h4 id="notification">
          {'Provider ' + provider.id + ' accepted service request at ' + JSON.stringify(seeker.location)}
          </h4>
          : null
        }
        <div id="map">
          <Map
            style="mapbox://styles/mapbox/streets-v9"
            containerStyle={{
              height: "100vh",
              width: "100vw"
            }}>
              <Layer
                type="symbol"
                id="marker"
                layout={{ "icon-image": "marker-15" }}>
                <Feature coordinates={[-87.618393, 41.862403]}/>
              </Layer>
          </Map>
        </div>
      </div>
    )
  }
}


