import React, {Component} from 'react';
import { connect } from 'react-redux';
import { auth, getError, clearError } from '../store';
import { withRouter } from 'react-router-dom';
import { Container, Card, Form, Message, Button, Divider } from 'semantic-ui-react';

class UserAuthForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.style = {
      display: 'flex',
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
      top: 0,
      bottom: 0,
      backgroundSize: 'cover',
      marginTop: 0,
      boxShadow: '0 0 0 1000px rgba(0,0,0,0.45) inset',
    };
  }

  render() {
  const {name, displayName, handleSubmit, handleClear, error} = this.props;
  return (
    <Container style={this.style} fluid>
      <Card centered raised>
        <Card.Content>
          <Card.Header textAlign="center">
            <h2>{displayName}</h2>
          </Card.Header>
          {
            name !== 'signup'
            ? <Form onSubmit={handleSubmit} name={name}>
              <Form.Input label="Email" name="email" type="email" />
              <Form.Input label="Password" name="password" type="password" />
              <Form.Input label="User Type" name="userType" />
              <Form.Button fluid>Submit</Form.Button>
            </Form>
            : <Form onSubmit={handleSubmit} name={name}>
              <Form.Input label="Name" name="userName" />
              <Form.Input label="Email" name="email" type="email" />
              <Form.Input label="Password" name="password" type="password" />
              <Form.Input label="Phone Number" name="phoneNumber" />
              <Form.Input label="User Type" name="userType" />
              <Form.Button fluid>Submit</Form.Button>
            </Form>
          }
          { error
            &&
            <div>
              <Divider hidden />
              <Message negative> {error} </Message>
              <Button onClick={handleClear}>Clear Error</Button>
            </div>
          }
        </Card.Content>
      </Card>
    </Container>
  );
  }
}

const mapLogin = (state) => {
  return {
    name: 'login',
    displayName: 'Login',
    error: state.error,
  };
};

const mapSignup = (state) => {
  return {
    name: 'signup',
    displayName: 'Sign Up',
    error: state.error,
  };
};

const mapDispatch = (dispatch) => {
  return {
    handleSubmit (evt) {
      evt.preventDefault();

      const formName = evt.target.name;

      let user = {};
      if (formName === 'login'){
        user = {
          email: evt.target.email.value,
          password: evt.target.password.value,
          userType: evt.target.userType.value,
        };
      }
      else if (formName === 'signup'){
        user = {
          name: evt.target.userName.value,
          email: evt.target.email.value,
          password: evt.target.password.value,
          phoneNumber: evt.target.phoneNumber.value,
          userType: evt.target.userType.value,
        };
      }

      if (user.userType === 'Seeker' || user.userType === 'Provider'){
        dispatch(auth(user, formName));
      }
      else {
        dispatch(getError('User type can be Seeker or Provider'));
      }
    },
    handleClear() {
      dispatch(clearError());
    }
  };
};

export const Login = withRouter(connect(mapLogin, mapDispatch)(UserAuthForm));
export const Signup = withRouter(connect(mapSignup, mapDispatch)(UserAuthForm));
