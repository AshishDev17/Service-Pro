'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import ServiceProvider from './ServiceProvider';
import ServiceSeeker from './ServiceSeeker';
import { Container} from 'semantic-ui-react';
import { me } from '../store';


class User extends Component {
  constructor(props){
    super(props);
    this.state ={

    };
    this.styles = {
      container: {
        padding: `5em`,
      }
    };
    //this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    this.props.loadUser();
  }

  render () {
    const styles = this.styles;
    const {user} = this.props;
    console.log('user', user);

    return (
      <Container style={styles.container} textAlign = 'center'>
        {
          user.userType === 'Seeker' &&
          <ServiceSeeker seeker={user} />
        }
        {
          user.userType === 'Provider' && <ServiceProvider provider={user} />
        }
      </Container>
    );
  }
}

const mapState = (state) => {
  return {
    user: state.user
  };
};

const mapDispatch = (dispatch) => {
  return {
      loadUser() {
      dispatch(me());
    }
  };
};

export default withRouter(connect(mapState, mapDispatch)(User));
