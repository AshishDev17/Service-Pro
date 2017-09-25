'use strict';
import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Router } from 'react-router';
import Navbar from './Navbar';
import {Login, Signup } from './UserAuthForm';
import User from './User';
import Home from './Home';
import Footer from './Footer';
import history from '../history';

export default class Root extends Component {

  render() {
    return (
      <Router history = { history }>
        <div>
          <Navbar />
          <div>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/signup" component={Signup} />
              <Route exact path="/user" component={User} />
            </Switch>
          </div>
          <Footer />
        </div>
      </Router>
    )
  }
}
