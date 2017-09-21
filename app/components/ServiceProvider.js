import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, NavLink } from 'react-router-dom';
import socket from '../socket';
import axios from 'axios';
import MapContainer from './MapContainer';
import { Container, Header, Divider, Button, Image, Item} from 'semantic-ui-react';

class ServiceProvider extends Component {
  constructor(props){
    super(props);
    this.state = {
      providerDetails: {},
      seekerDetails: {},
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
      seekerDetails: this.state.seekerDetails
    })
  }

  render () {
    const provider = this.state.providerDetails;
    const seeker = this.state.seekerDetails;
    console.log(provider);
    console.log(seeker);

    return (
      <div>
        {
          provider.id &&
          <div>
          <h1>Hello {provider.userName}</h1>
          <div>
            {JSON.stringify(provider)}
          </div>
          {
            seeker.seekerId &&
            <h4 id="notification">
            {'Seeker ' + seeker.seekerId + ' requested service at ' + JSON.stringify(seeker.location)}
            </h4>
          }
          <div>
            <button onClick={this.handleClick}>Respond To Service Request</button>
          </div>
          <MapContainer name = { provider.userName} long = { provider.location.coordinates[0] } lat = { provider.location.coordinates[1]  } icon = { provider.icon} />
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

