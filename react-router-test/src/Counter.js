import React, {Component} from 'react';

class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = {clickCount: 0};
    this.handleClick = this.handleClick.bind(this);
  }
  
  handleClick () {
    this.setState(function (state) {
      return {
        clickCount: state.clickCount + 1
      };
    });
  }

  render () {
    return (<h2 onClick={this.handleClick}>点我！快点我！你才点了{this.state.clickCount}次</h2>)
  }
}

export default Counter;