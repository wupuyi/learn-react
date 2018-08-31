import React, { Component } from 'react'

class Input extends Component {
  constructor() {
    super()
    this.state = {
      number: 0
    }
  }

  handleInput(event) {
    this.setState({
      number: event.target.value
    }, () => {
      if (this.props.onSubmit) {
        // 这里立马调用this.state.number不能取到更新后的state
        this.props.onSubmit(this.state.number)
      }
    })
    // if (this.props.onSubmit) {
    //   this.props.onSubmit(event.target.value)
    // }
  }

  render() {
    return (
      <div>
        <input
          type='number'
          onChange={this.handleInput.bind(this)}
          value={this.state.number} />
      </div>
    )
  }
}

class PercentageShower extends Component {
  static defaultProps = {
    number: 0
  }

  render() {
    return (
      <div>
        {
          (this.props.number * 100).toFixed(2) + '%'
        }
      </div>
    )
  }
}

class PercentageApp extends Component {
  constructor() {
    super()
    this.state = {
      number: 0
    }
  }

  handleChange(number) {
    this.setState({
      number: parseFloat(number)
    })
  }

  render() {
    return (
      <div>
        <Input onSubmit={this.handleChange.bind(this)} />
        <PercentageShower number={this.state.number} />
      </div>
    )
  }
}

export default PercentageApp
