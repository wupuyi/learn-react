import React, { Component } from 'react';

class HelloMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {value: 'Hello, Puyi!'};
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange (event) {
    this.setState({
      value: event.target.value
    });
  }

  render () {
    let value = this.state.value;
    return (
      <div>
        <input type="text" value={value} onChange={this.handleChange} />
        <h3>{value}</h3>
      </div>
    )
  }
}

export default HelloMessage;