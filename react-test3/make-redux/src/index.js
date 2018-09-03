// import React from 'react';
// import ReactDOM from 'react-dom';
// import './index.css';
// import App from './App';
// import registerServiceWorker from './registerServiceWorker';

// ReactDOM.render(<App />, document.getElementById('root'));
// registerServiceWorker();

// const appState = {
//   title: {
//     text: 'React.js小书',
//     color: 'red'
//   },
//   content:{
//     text: 'React.js小书内容',
//     color: 'blue'
//   }
// }

// 观察者模式
function createStore (state, action) {
  let state = null
  const listeners = []
  const subscribe = (listener) => listeners.push(listener)
  const getState = () => state
  const dispatch = (action) => {
    state = stateChanger(state, action)  // 覆盖原对象
    listeners.forEach((listener) => listener())
  }
  dispatch({})  // 初始化 state
  return { getState, dispatch, subscribe }
}

// 防止 oldAppState 没有传入，所以加了默认参数 oldAppState = {}
function renderApp (newAppState, oldAppState = {}) {
  if (newAppState === oldAppState) return // 数据没有变化就不渲染了
  renderTitle(newAppState.title)
  renderContent(newAppState.content)
}

function renderTitle (newTitle, oldTitle = {}) {
  if (newTitle === oldTitle) return  // 数据没有变化就不渲染
  const titleDOM = document.getElementById('title')
  titleDOM.innerHTML = newTitle.text
  titleDOM.style.color = newTitle.color
}

function renderContent (newContent, oldContent = {}) {
  if (newContent === oldContent) return  // 数据没有变化就不渲染
  const contentDOM = document.getElementById('content')
  contentDOM.innerHTML = newContent.text
  contentDOM.style.color = newContent.color
}

// 负责修改数据
function stateChanger (state, action) {
  if (!state) {
    return {
      title: {
        text: 'React.js小书',
        color: 'red'
      },
      content: {
        text: 'React.js小书内容',
        color: 'blue'
      }
    }
  }
  switch (action.type) {
    case 'UPDATE_TITLE_TEXT':
      return {  // 构建新的对象并且返回
        ...state,
        title: {
          ...state.title,
          text: action.text
        }
      }
    case 'UPDATE_TITLE_COLOR':
      return { // 构建新的对象并且返回
        ...state,
        title: {
          ...state.title,
          color: action.color
        }
      }
    default:
      return state  // 没有修改，返回原来的对象
  }
}

const store = createStore(null, stateChanger)
let oldState = store.getState()  // 缓存旧的state
store.subscribe(() => {
  const newState = store.getState() // 数据可能变化，获取新的state
  renderApp(newState, oldState)  //  把新旧的state传进去渲染
  oldState = newState  // 渲染完以后，新的 newState 变成了旧的 oldState，等待下一次数据变化重新渲染
})

renderApp(store.getState()) // 首次渲染页面
store.dispatch({ type: 'UPDATE_TITLE_TEXT', text: '《React.js 小书》' }) // 修改标题文本
store.dispatch({ type: 'UPDATE_TITLE_COLOR', color: 'blue' }) // 修改标题颜色
// ...后面不管如何 store.dispatch，都不需要重新调用 renderApp