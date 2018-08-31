import React, { Component } from 'react'

class AutoFocusInput extends Component {
  componentDidMount () {
    this.input.focus()
  }

  render () {
    return (
      <input ref={(input) => {this.input = input}} />
    )
  }
}

export default AutoFocusInput