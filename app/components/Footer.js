'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Menu, Link } from 'semantic-ui-react';


class Footer extends Component{
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
    return (
      <Menu floated fixed="bottom" style={this.styles.navbar}>
        <Menu.Menu style={this.styles.rightMenu}>
          <Menu.Item name="About Us" as={Link} to={`/`} />
          <Menu.Item name="Contact Us" as={Link} to={`/`} />
        </Menu.Menu>
      </Menu>
    );
  }
}

// const mapState = (state) => {};

// const mapDispatch = (dispatch) => ({
//   handleLogout: (evt) => {
//     evt.preventDefault();
//     //dispatch(logout());
//   },
// });

export default withRouter(connect(null, null)(Footer));
