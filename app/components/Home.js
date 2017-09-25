'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Container } from 'semantic-ui-react';


class Home extends Component {
  constructor(props){
    super(props);
    this.state ={

    };
  }

  render () {
    return (
        <Container className="landing-image" fluid />
    );
  }
}

export default withRouter(connect(null, null)(Home));
