import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import PercentNumber from './PercentNumber'
import ComponentLife from './ComponentLife'
import ShowClock from './ShowClock'
import AutoFocusInput from './AutoFocusInput'
import Card from './Card'
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();

class LikeButton extends Component {
  static defaultProps = {
    likedText: '取消',
    unlikedText: '点赞'
  }

  constructor () {
    super ()
    this.state = { isLiked: false }
  }

  handleClickOnLikeButton () {
    this.setState({
      isLiked: !this.state.isLiked
    })
  }

  render () {
    return (
      <button onClick={this.handleClickOnLikeButton.bind(this)}>
        {this.state.isLiked ? this.props.likedText : this.props.unlikedText}👍
      </button>
    )
  }
}

const users = [
  { username: 'Jerry', age: 21, gender: 'male' },
  { username: 'Tomy', age: 22, gender: 'male' },
  { username: 'Lily', age: 19, gender: 'female' },
  { username: 'Lucy', age: 20, gender: 'female' }
]

class User extends Component {
  render () {
    const { user } = this.props
    return (
      <div>
        <div>姓名: {user.username}</div>
        <div>年龄: {user.age}</div>
        <div>性别: {user.gender}</div>
        <hr />
      </div>
    )
  }
}

class Index extends Component {
  constructor () {
    super()
    this.state = {
      likedText: '已赞',
      unlikedText: '赞'
    }
  }

  handleClickOnChange () {
    this.setState({
      likedText: '取消',
      unlikedText: '点赞'
    })
  }

  render () {
    return (
      <div>
        <LikeButton 
          likedText={this.state.likedText}
          unlikedText={this.state.unlikedText} />
        <div>
          <button onClick={this.handleClickOnChange.bind(this)}>
            修改 wordings
          </button>
        </div>
        <div>
          {users.map((user, i) => <User key={i} user={user} />)}
        </div>
        <PercentNumber />
        <ComponentLife />
        <ShowClock />
        <AutoFocusInput />
        <Card>
          <div>
            <h2>React.js 小书</h2>
            <div>开源、免费、专业、简单</div>
            订阅：<input />
          </div>
        </Card>
      </div>
    )
  }
}

ReactDOM.render(
  <Index />,
  document.getElementById('root')
)