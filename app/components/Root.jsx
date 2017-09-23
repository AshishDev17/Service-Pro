'use strict';
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './Navbar';
import ServiceProvider from './ServiceProvider';
import ServiceSeeker from './ServiceSeeker';
import {Login, Signup } from './UserAuthForm';
import User from './User';
import Home from './Home';
import Footer from './Footer';

export default class Root extends Component {

  render() {
    return (
      <Router>
        <div>
          <Navbar />
          <div>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/user" component={User} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/signup" component={Signup} />
              <Route path="/provider/:providerId" component={ServiceProvider} />
              <Route path="/seeker/:seekerId" component={ServiceSeeker} />
            </Switch>
          </div>
          <Footer />
        </div>
      </Router>
    )
  }
}
