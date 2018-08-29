import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import App from './App';
// import registerServiceWorker from './registerServiceWorker';

// ReactDOM.render(<App />, document.getElementById('root'));
// registerServiceWorker();

class Title extends Component {
  render () {
    return (
      <h1>React 小书</h1>
    )
  }
}

class Header extends Component {

  renderGoodWord (goodWord, badWord) {
    const isGoodWord = true
    return isGoodWord ? goodWord : badWord
  }

  render () {
    return (
      <div>
        <h1>
          React 小书 
          {this.renderGoodWord(
            <strong> is good </strong>,
            <span> is not good </span>
          )
          }
        </h1>
      </div>
    )
  }
}

ReactDOM.render(
  <Header />,
  document.getElementById('root')
)