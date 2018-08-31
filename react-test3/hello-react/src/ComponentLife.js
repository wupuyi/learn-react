import React, { Component } from 'react'
import Header from './Header'

class ComponentLife extends Component {
  constructor () {
    super()
    this.state = {
      isShowHeader: true
    }
  }

  handleShowOrHide () {
    this.setState({
      isShowHeader: !this.state.isShowHeader
    })
  }

  render () {
    return (
      <div>
        {this.state.isShowHeader ? <Header /> : null}
        <button onClick={this.handleShowOrHide.bind(this)}>
          显示或隐藏标题
        </button>
      </div>
    )
  }
}

export default ComponentLife