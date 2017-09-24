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
    };
    this.styles = {
      container: {
        padding: `5em`,
      }
    };
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount(){
    const providerId = this.props.match.params.providerId;
    axios.get(`/api/provider/${providerId}`)
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
    const styles = this.styles;
    const provider = this.state.providerDetails;
    const seeker = this.state.seekerDetails;
    console.log(provider);
    console.log(seeker);

    return (
      <Container style={styles.container} textAlign = 'center'>
        {
          provider.id &&
          <div>
            <Header as = 'h1'>Hello Provider {provider.name}</Header>
            <Divider hidden />
            {
              seeker.seekerId &&
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
            <MapContainer name = { provider.name} long = { provider.location.coordinates[0] } lat = { provider.location.coordinates[1]  } icon = { provider.icon} />
        </div>
      }
      </Container>
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

