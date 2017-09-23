'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
//import UserLocation from './UserLocation';


class Home extends Component {
  constructor(props){
    super(props);
    this.state ={

    };
    this.styles = {
      container: {
        padding: `5em`,
      }
    };
  }

  render () {
    const styles = this.styles;

    return (
        <Container style={styles.container} textAlign = "center">
        </Container>
    )
  }
}

// const mapState = (state) => {
//   return {
//     user: state.user
//   };
// };

//const mapDispatch = (dispatch) => {};

export default withRouter(connect(null, null)(Home));
