import React, { Component } from 'react'
// 引入PropTypes用于指定默认的props属性
import PropTypes from 'prop-types'

class CommentInput extends Component {
  static propTypes = {
    onSubmit: PropTypes.func
  }

  constructor () {
    super()
    this.state = {
      username: '',
      content: ''
    }
  }

  componentWillMount() {
    this._loadUsername()
  }

  componentDidMount() {
    this.textarea.focus()
  }

  _loadUsername() {
    const username = localStorage.getItem('username')
    if (username) {
      this.setState({ username })
    }
  }

  _saveUsername(username) {
    localStorage.setItem('username', username)
  }

  // input输入绑定
  handleUsernameChange (event) {
    this.setState({
      username: event.target.value
    })
  }

  // textarea输入绑定
  handleContentChange (event) {
    this.setState({
      content: event.target.value
    })
  }

  // 发布按钮事件
  handleSubmit () {
    if (this.props.onSubmit) {
      this.props.onSubmit({
        username: this.state.username,
        content: this.state.content,
        // +new Date() 与 new Date().getTime()效果相同
        // 返回1970年1月1日至今的毫秒数
        createdTime: +new Date()
      })
    }
    this.setState({ content: '' })
  }
  
  handleUsernameBlur (event) {
    this._saveUsername(event.target.value)
  }

  render () {
    return (
      <div className='comment-input'>
        <div className='comment-field'>
          <span className='comment-field-name'>用户名：</span>
          <div className='comment-field-input'>
            <input
              value={this.state.username}
              onBlur={this.handleUsernameBlur.bind(this)}
              onChange={this.handleUsernameChange.bind(this)} />
          </div>
        </div>
        <div className='comment-field'>
          <span className='comment-field-name'>评论内容：</span>
          <div className='comment-field-input'>
            <textarea
              ref={(textarea) => this.textarea = textarea}
              value={this.state.content}
              onChange={this.handleContentChange.bind(this)} />
          </div>
        </div>
        <div className='comment-field-button'>
          <button
            onClick={this.handleSubmit.bind(this)}>
            发布
          </button>
        </div>
      </div>
    )
  }
}

export default CommentInput
