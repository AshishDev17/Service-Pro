import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, NavLink } from 'react-router-dom';
import socket from '../socket';
import ReactMapboxGl, { Marker, Layer, Feature } from "react-mapbox-gl";
import mapbox from 'mapbox';
import axios from 'axios';

export default class Provider extends Component {
  constructor(props){
    super(props);
    this.state = {
      providerDetails: {},
      seekerDetails:{}
    }

    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount(){
    const providerId = this.props.match.params.providerId;
    axios.get(`/api/providers/${providerId}`)
      .then(res => res.data)
      .then(provider => {
        this.setState({
          providerDetails: provider
      })
    });

    socket.emit('join', {providerId: providerId});
    socket.on('service-request', (seekerDetails) => {
      this.setState({
        seekerDetails: seekerDetails
      });
    })
  }

  handleClick (e) {
    socket.emit('request-accepted', {
      providerDetails: this.state.providerDetails,
      seekerDetails:this.state.seekerDetails
    })
  }

  render () {
    const Map = ReactMapboxGl({
      accessToken: "pk.eyJ1IjoiY29kZXIyMDE3IiwiYSI6ImNqN2FlNmI0ejBlOXcycW4wN2dkdHM0N2MifQ.NrK0rawJ0fJ4uGOna-cBaw"
    });
    const provider = this.state.providerDetails;
    const seeker = this.state.seekerDetails;
    console.log(provider);
    console.log(seeker);

    return (
      <div>
        <h1>Hello {provider.userName}</h1>
        <div>
          {JSON.stringify(provider)}
        </div>
        {
          seeker.seekerId
          ? <h4 id="notification">
          {'Seeker ' + seeker.seekerId + ' requested service at ' + JSON.stringify(seeker.location)}
          </h4>
          : null
        }
        <div>
          <button onClick={this.handleClick}>Respond To Service Request</button>
        </div>
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

