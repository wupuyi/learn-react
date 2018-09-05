import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import CommentInput from '../components/CommentInput'
import { addComment } from '../reducers/comments'

// CommentInputContainer
// 负责用户名的加载、保存、评论的发布
class CommentInputContainer extends Component {
  static propTypes = {
    comments: PropTypes.array,
    onSubmit: PropTypes.func
  }

  constructor () {
    super()
    this.state = { username: '' }
  }

  componentWillMount () {
    // componentWillMount 生命周期中初始化用户名
    this._loadUsername()
  }

  _loadUsername () {
    // 从LocalStorage 加载username
    // 然后可以在render方法中传给CommentInput
    const username = localStorage.getItem('username')
    if (username) {
      this.setState({ username })
    }
  }

  _saveUsername (username) {
    // 看看render方法的onUserNameInputBlur
    // 这个方法会在用户名输入框blur的时候被调用，保存用户名
    localStorage.setItem('username', username)
  }

  handleSubmitComment (comment) {
    // 评论数据的验证
    if (!comment) return
    if (!comment.username) return alert('请输入用户名')
    if (!comment.content) return alert('请输入评论内容')
    // 新增评论保存到LocalStorage中
    const { comments } = this.props
    const newComments = [...comments, comment]
    localStorage.setItem('comments', JSON.stringify(newComments))
    // this.props.onSubmit是connect传进来的
    // 会dispatch一个action去新增评论
    if (this.props.onSubmit) {
      this.props.onSubmit(comment)
    }
  }

  render () {
    return (
      <CommentInput 
        username={this.state.username}
        onUserNameInputBlur={this._saveUsername.bind(this)}
        onSubmit={this.handleSubmitComment.bind(this)}/>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    comments: state.comments
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onSubmit: (comment) => {
      dispatch(addComment(comment))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommentInputContainer)