'use strict';
import React, { Component } from 'react';
import {NavLink} from 'react-router-dom';

export default class Navbar extends Component{
  render() {
    return (
      <nav className="navbar navbar-default">
        <div className="container-fluid">
          {/*<div className="navbar-header">
            <NavLink className="navbar-brand" to="/">Home</NavLink>
          </div>*/}
          <div  id="bs-example-navbar-collapse-1">
            <ul className="nav navbar-nav">
              <li><NavLink to="/providers">Service Provider</NavLink></li>
              <li><NavLink to="/seekers">Service Seeker</NavLink></li>
            </ul>
          </div>
        </div>
      </nav>
    )
  }
}
