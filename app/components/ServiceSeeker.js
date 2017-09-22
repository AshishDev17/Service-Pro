'use strict';
import React, { Component } from 'react';
// import { connect } from 'react-redux';
// import { withRouter, NavLink } from 'react-router-dom';
import MapContainer from './MapContainer';
import { Container, Header, Divider, Button, Image, Item} from 'semantic-ui-react';
import socket from '../socket';

export default class ServiceSeeker extends Component {
  constructor(props){
    super(props);
    this.state ={
      seekerDetails: {},
      providerDetails: {}
    };
    this.styles = {
      container: {
        padding: `2em`,
      }
    };
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
      },
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
      <Container style={styles.container} textAlign = 'center'>
        {
          seeker.seekerId &&
          <div>
            <Header as = 'h1'>Hello User {seeker.seekerId}</Header>
            <Divider hidden />
            <Button onClick={this.handleClick} color = 'blue' positive >Request Service</Button>
            <Divider hidden />
            { provider.id &&
              <div>
                <Item>
                  <Item.Image size='tiny' src='' />
                  <Item.Content>
                    <Item.Description>{'Service provider ' + provider.userName + ' has accepted you service request'}</Item.Description>
                  </Item.Content>
              </Item>
              <Divider hidden />
              </div>
            }
            <MapContainer name = { seeker.name} long = { seeker.location.longitude } lat = { seeker.location.latitude  }  icon = {seeker.icon} />
          </div>
        }
        </Container>
    )
  }
}
