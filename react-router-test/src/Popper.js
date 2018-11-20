// {/* <button onClick={(e) => this.deleteRow(id, e)}>Delete Row</button> */}
// {/* <button onClick={this.deleteRow.bind(this, id)}>Delete Row</button> */}
import React, { Component } from 'react';

class Popper extends Component {
  constructor() {
    super();
    this.state = {name: 'Hello, World!'};
  }
  // 参数 e 作为 React 事件对象将会被作为第二个参数进行传递。
  preventPop(name, e) {
    e.preventDefault();
    alert(name);
  }

  render() {
    return (
      <div>
        <p>hello</p>
        {/* 通过 bind() 方法传递参数。 */}
        <a href="https://reactjs.org" onClick={this.preventPop.bind(this, this.state.name)}>Click</a>
      </div>
    );
  }
}

export default Popper;