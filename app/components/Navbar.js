'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';
import { logout } from '../store';

class Navbar extends Component{
   constructor(props) {
    super(props);
    this.state = {};
    this.styles = {
      navbar: {
        height: `3.8em`,
      },
      title: {
        fontSize: '1.2em',
        fontFamily: 'Oleo Script',
      },
      rightMenu: {
        width: '145px',
      },
    };
  }

  render() {
    const { isLoggedIn, handleLogout } = this.props;
    return (
      <Menu floated fixed="top" stackable style={this.styles.navbar}>
        {isLoggedIn ? (
          <Menu.Menu>
            <Menu.Item position="right" name={`Logout`} onClick={handleLogout} />
          </Menu.Menu>
        ) : (
          <Menu.Menu >
            <Menu.Item position="right" name="Login" as={Link} to={`/login`} />
            <Menu.Item name="Sign Up" as={Link} to={`/signup`} />
          </Menu.Menu>
        )}
      </Menu>
    );
  }
}

const mapState = (state) => {
  return {
    isLoggedIn: !!state.user.id,
  };
};

const mapDispatch = (dispatch) => ({
  handleLogout: (evt) => {
    evt.preventDefault();
    dispatch(logout());
  },
});

export default withRouter(connect(mapState, mapDispatch)(Navbar));
