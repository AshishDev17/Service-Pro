'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import ServiceProvider from './ServiceProvider';
import ServiceSeeker from './ServiceSeeker';
import { Container} from 'semantic-ui-react';


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

  render () {
    const styles = this.styles;
    const {user} = this.props;

    return (
      <Container style={styles.container} textAlign = 'center'>
        {
          user.type === 'Seeker'
          ? <ServiceSeeker user={user} />
          : <ServiceProvider user={user} />
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

//const mapDispatch = (dispatch) => {};

export default withRouter(connect(mapState, null)(User));
