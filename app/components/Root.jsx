'use strict'
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import store from '../store';
import Navbar from './Navbar';
import ServiceProvider from './ServiceProvider';
import ServiceSeeker from './ServiceSeeker';

export default class Root extends Component {

  render() {
    return (
      <Router>
        <div>
          {/*<div>
            <Navbar />
          </div>*/}
          <div className="container-fluid">
            <Switch>
              <Route path="/providers/:providerId" component={ServiceProvider} />
              <Route path="/seekers/:seekerId" component={ServiceSeeker} />
            </Switch>
          </div>
        </div>
      </Router>
    )
  }
}
