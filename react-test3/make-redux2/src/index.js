import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

// 使用观察者模式
function createStore(reducer) {
  let state = null
  const listeners = []
  // 通过store.subscribe方式传递监听函数
  // subscribe 订阅
  const subscribe = (listener) => listeners.push(listener)
  // 获取state
  const getState = () => state
  // dispatch
  const dispatch = (action) => {
    state = reducer(state, action) // 覆盖原对象
    listeners.forEach((listener) => listener())
  }
  dispatch({}) // 初始化state
  return { getState, dispatch, subscribe }
}

// 初始化和计算新的state
function reducer (state, action) {
  if (!state) {
    return {
      title: {
        text: 'React.js 小书',
        color: 'red',
      },
      content: {
        text: 'React.js 小书内容',
        color: 'blue',
      }
    }
  }
  switch (action.type) {
    case 'UPDATE_TITLE_TEXT':
      return { // 构建新的对象并且返回
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
      return state; // 没有修改，返回原来的对象
  }
}

// const appState = {
//   title: {
//     text: 'React.js 小书',
//     color: 'red',
//   },
//   content: {
//     text: 'React.js 小书内容',
//     color: 'blue',
//   }
// }

// 防止 oldAppState 没有传入，所以加了默认参数 oldAppState = {}
function renderApp (newAppState, oldAppState = {}) {
  if (newAppState === oldAppState) return
  renderTitle(newAppState.title, oldAppState.title);
  renderContent(newAppState.content, oldAppState.content);
}

function renderTitle(newTitle, oldTitle = {}) {
  if (newTitle === oldTitle) return
  const titleDOM = document.getElementById('title');
  titleDOM.innerHTML = newTitle.text;
  titleDOM.style.color = newTitle.color;
}

function renderContent (newContent, oldContent = {}) {
  if (newContent === oldContent) return
  const contentDOM = document.getElementById('content');
  contentDOM.innerHTML = newContent.text;
  contentDOM.style.color = newContent.color;
}



const store = createStore(reducer);
let oldState = store.getState(); // 缓存旧的state
// 监听数据变化，当dispatch的时候执行renderApp
store.subscribe(() => {
  const newState = store.getState(); // 数据可能变化，获取新的state
  renderApp(newState, oldState); // 把新旧的state传进去渲染
  oldState = newState; // 渲染完成以后，新的newState 变成了旧的oldState，等待下一次数据变化重新渲染
});

renderApp(store.getState());  // 首次渲染页面
store.dispatch({ type: 'UPDATE_TITLE_TEXT', text: 'React.js 小书真的好棒啊！' });
store.dispatch({ type: 'UPDATE_TITLE_COLOR', color: 'green' })
// renderApp(appState);

// ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
