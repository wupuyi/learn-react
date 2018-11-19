import React, { Component } from 'react';
import Clock from './Clock';
import Website from './Website';
import MyTitle from './MyTitle';
import './App.css';

let title = 'Puyi Wu';

class App extends Component {

  render() {
    return (
      <div className="App">
        <Clock />
        <Website />
        <MyTitle title={title} />
      </div>
    );
  }
}

export default App;
