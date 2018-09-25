import React, { Component } from 'react'
import PropTypes from 'prop-types'

class CommentInput extends Component {
  static propTypes = {
    username: PropTypes.any,
    onSubmit: PropTypes.func,
    onUserNameInputBlur: PropTypes.func
  }

  static defaultProps = {
    username: ''
  }

  constructor (props) {
    super(props)
    this.state = {
      username: props.username,   // 从props上取username字段
      content: ''
    }
  }

  // componentWillMount () {
  //   this._loadUsername()
  // }

  componentDidMount () {
    this.textarea.focus()
  }

  // 失去焦点时存储用户名
  handleUsernameBlur(event) {
    // this._saveUsername(event.target.value)
    if (this.props.onUserNameInputBlur) {
      this.props.onUserNameInputBlur(event.target.value)
    }
  }
  // 用户名
  handleUsernameChange (event) {
    this.setState({
      username: event.target.value
    })
  }
  // 评论内容
  handleContentChange (event) {
    this.setState({
      content: event.target.value
    })
  }
  // 提交
  handleSubmit () {
    if (this.props.onSubmit) {
      const { username, content } = this.state
      this.props.onSubmit({ 
        username,
        content,
        createdTime: +new Date()
      })
    }
    this.setState({ content: '' })
  }

  // _loadUsername () {
  //   const username = localStorage.getItem('username')
  //   if (username) {
  //     this.setState({ username })
  //   }
  // }

  // _saveUsername (username) {
  //   localStorage.setItem('username', username)
  // }

  render () {
    return (
      <div className='comment-input'>
        <div className='comment-field'>
          <span className='comment-field-name'>用户名:</span>
          <div className='comment-field-input'>
            <input
              value={this.state.username}
              onBlur={this.handleUsernameBlur.bind(this)}
              onChange={this.handleUsernameChange.bind(this)} />
          </div>
        </div>
        <div className='comment-field'>
          <span className='comment-field-name'>评论内容:</span>
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
