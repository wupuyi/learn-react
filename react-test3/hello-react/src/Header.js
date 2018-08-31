import React, { Component } from 'react'

class Header extends Component {
  constructor () {
    super()
    console.log('construct')
  }

  componentWillMount () {
    console.log('component will mount')
  }

  componentDidMount () {
    console.log('component did mount')
  }

  componentWillUnmount () {
    console.log('component will unmount')
  }

  render() {
    console.log('render')
    return (
      <h1>React 小书</h1>
    )
  }
}

export default Header
