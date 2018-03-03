/*
 * 创建action
 * @Author: 56 
 * @Date: 2018-03-04 00:14:33 
 * @Last Modified by: 56
 * @Last Modified time: 2018-03-04 00:40:32
 */
import { createAction, createAsyncAction } from '../redux-async'
import * as ActionTypes from '../constant'

const iSleep = () =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      Math.random() > 0.3
        ? resolve('It is ok')
        : reject(new Error('It is failure'))
    }, Math.random() * 2000 + 1000)
  })

export const reset = createAction(ActionTypes.RESET, e => 0) // 重置
export const sleep = createAsyncAction(ActionTypes.SLEEP, sleep) // 休眠时间
