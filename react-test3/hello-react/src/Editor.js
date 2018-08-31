import React, { Component } from 'react'

class Editor extends Component {
  constructor () {
    super()
    this.state = {
      content: '<h1>React.js 小书</h1>',
      color: '#235689'
    }
  }

  render () {
    return (
      <div className='editor-wrapper'>
        <div dangerouslySetInnerHTML={{ __html: this.state.content }}></div>
        <h2 style={{fontSize: '12px', color: this.state.color}}>学习学习</h2>
      </div>
    )
  }
}

export default Editor