import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, NavLink } from 'react-router-dom';
import socket from '../socket';
import axios from 'axios';
import MapContainer from './MapContainer';
import { Container, Header, Divider, Button, Image, Item} from 'semantic-ui-react';

const locations = [
  {
   location: {
      type: 'Point',
      coordinates: [-87.9806265, 42.0883603],
      crs: { type: 'name', properties: { name: 'EPSG:4326'} }
    }
  },
  {
   location: {
      type: 'Point',
      coordinates: [-87.6876969, 42.0450722],
      crs: { type: 'name', properties: { name: 'EPSG:4326'} }
    }
  },
  {
   location: {
      type: 'Point',
      coordinates: [-88.0834059, 42.0333607],
      crs: { type: 'name', properties: { name: 'EPSG:4326'} }
    }
  },
  {
   location: {
      type: 'Point',
      coordinates: [-87.67513043, 41.9214378],
      crs: { type: 'name', properties: { name: 'EPSG:4326'} }
    }
  },
  {
   location: {
      type: 'Point',
      coordinates: [-87.6238803, 41.8708586],
      crs: { type: 'name', properties: { name: 'EPSG:4326'} }
    }
  },
  {
   location: {
      type: 'Point',
      coordinates: [-88.1535352, 41.7508391],
      crs: { type: 'name', properties: { name: 'EPSG:4326'} }
    }
  },
  {
   location: {
      type: 'Point',
      coordinates: [-87.8833991, 42.0333623],
      crs: { type: 'name', properties: { name: 'EPSG:4326'} }
    }
  },
  {
   location: {
      type: 'Point',
      coordinates: [-87.8289548, 42.1275267],
      crs: { type: 'name', properties: { name: 'EPSG:4326'} }
    }
  },
  {
   location: {
      type: 'Point',
      coordinates: [-87.7539448, 41.8455877],
      crs: { type: 'name', properties: { name: 'EPSG:4326'} }
    }
  },
  {
   location: {
      type: 'Point',
      coordinates: [-87.9403418, 41.8994744],
      crs: { type: 'name', properties: { name: 'EPSG:4326'} }
    }
  }
];


class ServiceProvider extends Component {
  constructor(props){
    super(props);
    this.state = {
      provider: {},
      seeker: {},
    };
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount(){
    const provider = Object.assign({}, this.props.provider, locations[Math.ceil(Math.random()*(9 - 0))]);
    this.setState({
      provider: provider,
    });
    socket.emit('join', provider);
    socket.on('service-request', (seekerDetails) => {
      console.log('service request from ', seekerDetails);
      this.setState({
        seeker: seekerDetails
      });
      console.log('this state ', this.state);
    });
  }

  handleClick (e) {
    socket.emit('request-accepted', {
      providerDetails: this.state.provider,
      seekerDetails: this.state.seeker,
    });
  }

  render () {
    const provider = this.state.provider;
    const seeker = this.state.seeker;
    const locationMarkers = [];
    console.log(provider);
    console.log(seeker);
    if ( provider.id && seeker.id ){
      locationMarkers.push({
        name: provider.name,
        icon: provider.icon,
        coordinates: provider.location.coordinates,
      });
      locationMarkers.push({
        name: seeker.name,
        icon: seeker.icon,
        coordinates: seeker.location.coordinates,
      });
    }

    return (
      <div>
        {
          provider.id &&
          <div>
            <Header as = 'h1'>Hello  {provider.name}</Header>
            <Divider hidden />
            {
              seeker.id &&
              <div>
                <Item>
                  <Item.Image size='tiny' src='' />
                  <Item.Content>
                    <Item.Description>
                    {'User ' + seeker.name + ' has requested a service'}
                    </Item.Description>
                  </Item.Content>
                </Item>
                <Divider hidden />
                <Button onClick={this.handleClick}> Respond To Service Request</Button>
                <Divider hidden />
              </div>
            }
            <MapContainer markers = { locationMarkers} long = { provider.location.coordinates[0] } lat = { provider.location.coordinates[1]  } icon = { provider.icon} />
        </div>
      }
      </div>
    )
  }
}


/**
 * CONTAINER
 */
const mapState = (state) => {};

const mapDispatch = (dispatch) => {};

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(null, null)(ServiceProvider));

