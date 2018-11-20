import React, { Component } from 'react';

class FlavorForm extends Component {
  constructor(props) {
    super(props);
    this.state = {value: 'cocount'};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    console.log(event.target.value)
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('Your favorite flavor is: ' + this.state.value);
    event.preventDefault();
  }
  
  render () {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          选择您最喜欢的网站
          <select value={this.state.value} onChange={this.handleChange}>
            <option value="gg">Google</option>
            <option value="ap">Apple</option>
            <option value="tb">Taobao</option>
            <option value="fb">FaceBook</option>
          </select>
        </label>
        <input type="submit" value="提交" />
      </form>
    )
  }
}

export default FlavorForm;