import React, { Component } from 'react';

function FormattedDate(props) {
  return <h2>现在是 {props.date.toLocaleTimeString()}.</h2>;
}

class Clock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date()
    };
  }

  componentDidMount () {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount () {
    clearInterval(this.timerID);
  }

  tick () {
    this.setState({
      date: new Date()
    });
  }
  
  render () {
    return (
      <div>
        <h1>Hello, World!</h1>
        <FormattedDate date={this.state.date}/>
      </div>
    );
  }
}

export default Clock;