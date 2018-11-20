import React, { Component } from 'react';

class Toggle extends Component {
  constructor (props) {
    super(props);
    this.state = {isToggleOn: true};
    // 类的方法默认是不会绑定this的
    this.handleClick = this.handleClick.bind(this);
  }

  // 不绑定this的解决方法
  // 1. 推荐使用，属性初始化器语法
  // handleClick = () => {
  //   console.log('this is: ', this);
  // }
  // 2.
  // <button onClick={(e) => {this.handleClick(e)}}>Click me</button>

  handleClick () {
    this.setState(prevState => ({
      isToggleOn: !prevState.isToggleOn
    }));
  }

  render () {
    return (
      <button onClick={this.handleClick}>
        {this.state.isToggleOn ? 'ON' : 'OFF'}
      </button>
    );
  }
}

export default Toggle;