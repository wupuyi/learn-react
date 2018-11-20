import React, { Component } from 'react';

class Content extends Component {
  render () {
    return (
      <div>
        <input
          type="text"
          value={this.props.myDataProp}
          onChange={this.props.updateStateProp}
        />
        <h3>{this.props.myDataProp}</h3>
      </div>
    );
  }
}

class HelloMy extends Component {
  constructor(props) {
    super(props);
    this.state = {value: 'Hello Puyi!'};
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  render () {
    let value = this.state.value;
    return (
      <div>
        <Content myDataProp={value} updateStateProp={this.handleChange}></Content>
      </div>
    );
  }
}

export default HelloMy;