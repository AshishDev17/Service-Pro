import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter} from 'react-router-dom';
import socket from '../socket';
import MapContainer from './MapContainer';
import { Header, Divider, Button, Message} from 'semantic-ui-react';

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
    this.styles = {
      message: {
        width: '1075px',
        height: '70px',
      },
    };
    this.handleRequest = this.handleRequest.bind(this);
    this.handleComplete = this.handleComplete.bind(this);
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
    socket.on('request-complete', (data) => {
      this.setState({
        seeker: {},
      });
    });
  }

  handleRequest (e) {
    socket.emit('request-accepted', {
      providerDetails: this.state.provider,
      seekerDetails: this.state.seeker,
    });
  }

   handleComplete (e) {
    socket.emit('request-complete', {
      providerDetails: this.state.provider,
      seekerDetails: this.state.seeker,
    });
  }

  render () {
    const styles = this.styles;
    const provider = this.state.provider;
    const seeker = this.state.seeker;
    const locationMarkers = [];
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
                <Message positive style = {styles.message}>
                  <Message.Header>
                    Service Request Notification
                  </Message.Header>
                  <p>
                    {seeker.name + ' has requested a service at latitude: ' + seeker.location.coordinates[1] + ' longitude: ' + seeker.location.coordinates[0]}
                  </p>
                </Message>
                <Divider hidden />
                <Button onClick={this.handleRequest}> Respond To Service Request</Button>
                <Button onClick={this.handleComplete}> Complete To Service Request</Button>
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
// const mapState = (state) => {};

// const mapDispatch = (dispatch) => {};

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(null, null)(ServiceProvider));

