import React, { Component } from 'react'

export default (WrappedComponent, url) => {
  class NewComponent extends Component {
    constructor() {
      super()
      this.state = {
        content: null
      }
    }

    componentWillMount() {
      this._loadData()
    }

    _loadData() {
      this.setState({
        content: '数据加载中...'
      }, () => {
        getData(url)
          .then(response => {
            this.setState({
              content: response
            })
          })
      })
    }

    render() {
      const props = {
        content: this.state.content,
        refresh: this._loadData.bind(this),
        ...this.props
      }
      return (
        <WrappedComponent {...props} />
      )
    }
  }

  return NewComponent
}