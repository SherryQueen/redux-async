/* 
 * 创建reducers
 * @Author: 56 
 * @Date: 2018-03-04 00:17:39 
 * @Last Modified by: 56
 * @Last Modified time: 2018-03-04 00:40:58
 */
import { createReducer } from '../redux-async'
import * as ActionTypes from '../constant'

const initState = {
  count: 0,
  isLoading: false,
}

export const count = (state = initState.count, action) =>
  action.type === ActionTypes.RESET ? 0 : state

export const isLoading = (state = initState.isLoading, action) =>
  action.type === ActionTypes.LOADING ? action.payload : state

export const sleep = createReducer()
  .when(ActionTypes.SLEEP, (oldState, action) => {
    console.log(oldState, action)
  })
  .done((oldState, action) => {
    console.log(oldState, action)
  })
  .catch((oldState, action) => {
    console.log(oldState, action)
  })
  .build()
