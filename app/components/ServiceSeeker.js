'use strict';
import React, { Component } from 'react';
// import { connect } from 'react-redux';
// import { withRouter, NavLink } from 'react-router-dom';
import MapContainer from './MapContainer';
import socket from '../socket';

export default class ServiceSeeker extends Component {
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
      name: 'Seeker 1',
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
    console.log('seeker', seeker);
    console.log('provider', provider);

    return (
      <div>
        {
          seeker.seekerId &&
          <div>
            <h1>Hello Citizen {seeker.seekerId}</h1>
            <div>
              <button onClick={this.handleClick}>Request Service</button>
            </div>
            {provider.id &&
              <h4 id="notification">
              {'Provider ' + provider.id + ' accepted service request at ' + JSON.stringify(seeker.location)}
              </h4>
            }
            <MapContainer name = { seeker.name} long = { seeker.location.longitude } lat = { seeker.location.latitude  }  />
          </div>
        }
        </div>
    )
  }
}
