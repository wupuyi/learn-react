import React, { Component } from 'react';
import Clock from './Clock';
import Website from './Website';
import MyTitle from './MyTitle';
import Toggle from './Toggle';
import Greeting from './Greeting';
import NumberList from './NumberList';
import Counter from './Counter';
import Hello from './Hello';
import Button from './Button';
import HelloMessage from './HelloMessage';
import HelloMy from './HelloMy';
import FlaovrForm from './FlavorForm';
import './App.css';

let title = 'Puyi Wu';

class App extends Component {
  render() {
    const numbers = [1, 2, 3, 4, 5];
    return (
      <div className="App">
        <Clock />
        <Website />
        <MyTitle title={title} />
        <Toggle />
        <Greeting isLoggedIn={true}/>
        <NumberList numbers={numbers}/>
        <Counter />
        <Hello />
        <Button />
        <HelloMessage />
        <HelloMy />
        <FlaovrForm />
      </div>
    );
  }
}

export default App;
