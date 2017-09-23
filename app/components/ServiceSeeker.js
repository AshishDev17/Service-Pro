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
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount(){

    const seekerId = this.props.match.params.seekerId;
    const seekerDetails = {
      seekerId: seekerId,
      name: 'Seeker 1',
      // location: {
      //   longitude: this.props.coords.latitude,
      //   latitude: this.props.coords.longitude,
      // },
      icon: '/images/orange_marker.png',
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
    const styles = this.styles;
    const seeker = this.state.seekerDetails;
    const provider = this.state.providerDetails;
    console.log('seeker', seeker);
    console.log('provider', provider);

    return (
      <div>
        {
          seeker.seekerId &&
          <div>
            <Header as = 'h1'>Hello User {seeker.seekerId}</Header>
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
                  <Button onClick={this.handleClick} color = 'blue' positive >Request Service</Button>
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
