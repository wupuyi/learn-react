const createDOMFromString = (domString) => {
  const div = document.createElement('div')
  div.innerHTML = domString
  return div
}

const mount = (component, wrapper) => {
  wrapper.appendChild(component._renderDOM())
  component.onStateChange = (oldEl, newEl) => {
    wrapper.insertBefore(newEl, oldEl)
    wrapper.removeChild(oldEl)
  }
}

class Component {
  // 组件子类继承的时候只需要实现一个返回HTML字符串的render方法

  constructor (props = {}) {
    this.props = props
  }

  setState(state) {
    const oldEl = this.el
    this.state = state
    this._renderDOM()
    if (this.onStateChange) this.onStateChange(oldEl, this.el)
  }

  _renderDOM () {
    // 调用this.render来构建DOM元素，并监听onClick事件
    this.el = createDOMFromString(this.render())
    if (this.onClick) {
      this.el.addEventListener('click', this.onClick.bind(this), false)
    }
    return this.el
  }
}

class LikeButton extends Component {
  constructor(props) {
    super(props)
    this.state = { isLiked: false }
  }

  onClick () {
    this.setState({
      isLiked: !this.state.isLiked
    })
  }

  render () {
    return `
    <button id='like-btn' style="background-color: ${this.props.bgColor}">
        <span class='like-text'>${this.state.isLiked ? '取消' : '点赞'}</span>
        <span>👍</span>
      </button>
    `
  }
}

// mount(new LikeButton({bgColor: 'red'}), wrapper)


class RedBlueButton extends Component {
  constructor (props) {
    super(props)
    this.state = {
      color: 'red'
    }
  }

  onClick () {
    this.setState({
      color: 'blue'
    })
  }

  render () {
    return `
      <div style='color: ${this.state.color};'>${this.state.color}</div>
    `
  }
}

mount(new RedBlueButton(), document.querySelector('.like-btn'))