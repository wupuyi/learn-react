import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import Header from './Header';
import Content from './Content';
import './index.css';
import * as serviceWorker from './serviceWorker';

class Index extends Component {
  render () {
    return (
      <div>
        <Header />
        <Content />
      </div>
    )
  }
}

ReactDOM.render(<Index />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
