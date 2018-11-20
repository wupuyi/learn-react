import React from 'react';

function UserGreeting(props) {
  return <h1>Welcome to back!</h1>;
}

function GuestGreeting(props) {
  return <h1>请注册</h1>;
}

function Greeting(props) {
  const isLoggedIn = props.isLoggedIn;
  if (isLoggedIn) {
    return <UserGreeting />;
  }
  return <GuestGreeting />;
}

export default Greeting;