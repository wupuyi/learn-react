import React, {Component} from 'react';

/**
 * 
 * @param {应用程序状态} state 
 * @param {描述应用程序根据action发生什么变化} stateChanger 
 * 
 */
function createStore (state, stateChanger) {
  const getState = () => state
  const dispatch = (action) => stateChanger(state, action)
  return { getState, dispatch }
}
