import React, {Component} from 'react';
import Greeting from './Greeting';

class LoginControl extends Component {
  constructor (props) {
    super (props);
    this.state = {isLoggedIn: true};
  }
  
  handleLoginClick () {
    this.setState({isLoggedIn: true});
  }

  handleLogOutClick() {
    this.setState({isLoggedIn: false});
  }

  render() {
    const isLoggedIn = this.state.isLoggedIn;

    let button = null;
    if (isLoggedIn) {
      button = <LogoutButton onClick={this.handleLogOutClick} />;
    } else {
      button = <LoginButton onCLick={this.handleLoginClick} />;
    }

    return (
      <div>
        <Greeting isLoggedIn={isLoggedIn} />
        {button}
      </div>
    )
  }
}

export default LoginControl;