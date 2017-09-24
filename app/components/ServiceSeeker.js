'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import MapContainer from './MapContainer';
import {geolocated, geoPropTypes} from 'react-geolocated';
import { Container, Header, Divider, Button, Image, Message, Item} from 'semantic-ui-react';
import socket from '../socket';


class Seeker extends Component {
  constructor(props){
    super(props);
    this.state ={
      seekerDetails: {},
      providerDetails: {},
      location: {},
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

    // const seekerId = this.props.match.params.seekerId;
    // const seekerDetails = {
    //   seekerId: seekerId,
    //   name: 'Seeker 1',
    //   // location: {
    //   //   longitude: this.props.coords.latitude,
    //   //   latitude: this.props.coords.longitude,
    //   // },
    //   icon: '/images/orange_marker.png',
    // };
    // //setting the state with fake data
    // this.setState({
    //   seekerDetails: seekerDetails
    // });
    const seekerId = this.props.seeker.id;
    socket.emit('join', {seekerId: seekerId});
    socket.on('request-accepted', (providerDetails) => {
      this.setState({
        providerDetails: providerDetails
      });
    })
  }

  handleRequest (e, seeker) {
    this.setState({
        seekerDetails: seeker
      });
    socket.emit('service-request', seeker);
  }

  render () {
    const styles = this.styles;
    const {seeker} = this.props;
    const provider = this.state.providerDetails;
    console.log('seeker', seeker);
    console.log('provider', provider);

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
                  <Button onClick={(e) => this.handleRequest(e, Object.assign({}, seeker, {latitude: this.props.coords.latitude, longitude: this.props.coords.longitude }))} color = 'blue' positive >Request Service</Button>
                  <Divider hidden />
                  { provider.id &&
                    <div>
                      <Item>
                        <Item.Image size='tiny' src='' />
                        <Item.Content>
                          <Item.Description>{'Service provider ' + provider.name + ' has accepted you service request'}</Item.Description>
                        </Item.Content>
                    </Item>
                    <Divider hidden />
                    </div>
                  }
                  <MapContainer name = { seeker.name} long = { this.props.coords.longitude } lat = { this.props.coords.latitude  }  icon = {seeker.icon} />
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

const mapState = (state) => {
  return {};
};

const mapDispatch = (dispatch) => {
  return {};
};

export default withRouter(connect(null, null)(ServiceSeeker));
