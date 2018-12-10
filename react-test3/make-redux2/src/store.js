import React, {Component} from 'react';

/**
 * 
 * @param {应用程序状态} state 
 * @param {描述应用程序根据action发生什么变化} stateChanger 
 * 
 * 
 */
// stateChanger 参考
// function dispatch(action) {
//   switch (action.type) {
//     case 'UPDATE_TITLE_TEXT':
//       appState.title.text = action.text
//       break;
//     case 'UPDATE_TITLE_COLOR':
//       appState.title.color = action.color
//       break;
//     default:
//       break;
//   }
// }

// 使用观察者模式
function createStore (state, stateChanger) {
  const listeners = []
  // 通过store.subscribe方式传递监听函数
  // subscribe 订阅
  const subscribe = (listener) => listeners.push(listener)
  // 获取state
  const getState = () => state
  // dispatch
  const dispatch = (action) => {
    stateChanger(state, action)
    listeners.forEach((listener) => listener())
  }
  return { getState, dispatch, subscribe }
}
