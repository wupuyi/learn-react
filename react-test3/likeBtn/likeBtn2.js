const createDOMFromString = (domString) => {
  const div = document.createElement('div')
  div.innerHTML = domString
  return div
}

/***
 * 
 * 优化目的：减少DOM操作
 * 
 * 解决方案：一旦状态发生改变，就重新调用render方法，构建一个新的DOM元素。
 * 
 */

class LikeButton {
  constructor() {
    this.state = { isLiked: false }
  }

  setState (state) {
    const oldEl = this.el
    this.state = state
    this.el = this.render()
    if (this.onStateChange) this.onStateChange(oldEl, this.el)
  }
  
  // 只用了解数据，不需要操作DOM，setStatej会重新渲染DOM
  changeLikeText() {
    this.setState({
      isLiked: !this.state.isLiked
    })
  }

  render() {
    this.el = createDOMFromString(`
      <button id='like-btn'>
        <span class='like-text'>${this.state.isLiked ? '取消' : '点赞'}</span>
        <span>👍</span>
      </button>
    `)
    this.el.addEventListener('click', this.changeLikeText.bind(this), false)
    return this.el
  }
}

const likeBtn = document.querySelector('.like-btn')
const likeButton = new LikeButton()
// 第一次插入DOM元素
likeBtn.appendChild(likeButton.render())
likeButton.onStateChange = (oldEl, newEl) => {
  likeBtn.insertBefore(newEl, oldEl)  // 插入新的元素
  likeBtn.removeChild(oldEl)  // 删除旧的元素
}
