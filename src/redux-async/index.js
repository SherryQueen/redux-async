/*
 * 自行封装的 Redux 异步组件
 * 参照 redux-action-tools (https://github.com/kpaxqin/redux-action-tools)
 * 基于 redux-thunk使用 
 * TODO: 打包为npm包
 * @Author: 56 
 * @Date: 2018-03-03 23:22:39 
 * @Last Modified by: 56
 * @Last Modified time: 2018-03-04 16:49:51
 */

// 状态值
const STATUS = {
  SUCCESS: 'SUCCESS',
  FAILURE: 'FAILURE',
}

// Reducer处理方法, 类似 Promise
class ActionHandler {
  constructor() {
    this.handlers = {}
    this.currentAction = undefined
  }

  /**
   * 异步请求开始 Reducer处理
   * @param {String}   actionType action类型
   * @param {Function} handler    对应action 的开始异步 Reducer
   */
  when(actionType, handler) {
    this.currentAction = actionType
    this.handlers[this.currentAction] = handler
    return this
  }

  /**
   * 异步请求完成 Reducer处理
   * @param {Function} handler 对应action 的异步成功 Reducer
   */
  then(handler) {
    this._checkFailure()
    this.handlers[`${this.currentAction}_${STATUS.SUCCESS}`] = handler
    return this
  }

  /**
   * 异步请求失败 Reducer处理
   * @param {Function} handler 对应action 的异步失败 Reducer
   */
  catch(handler) {
    this._checkFailure()
    this.handlers[`${this.currentAction}_${STATUS.FAILURE}`] = handler
    return this
  }

  // 创建该 Reducer对象
  build(initValue) {
    // 返回生成的 Reducer 用于 Redux用
    return (state = initValue, action) => {
      // 接收到Action 调用对应的Reducer方法进行处理
      const handler = action ? this.handlers[action.type] : undefined

      // 若处理方法存在
      if (typeof handler === 'function')
        /**
         * @param state  原有的值
         * @param action 当前的操作对象
         */
        return handler(state, action.payload)

      // 若无处理方法, 返回初始值
      return state
    }
  }

  // 检查当前的action是否存在
  _checkFailure() {
    if (!this.currentAction) throw new Error('Action is error')
  }
}

// 创建同步action
export const createAction = type => payload => ({
  type,
  payload,
})

/**
 * 创建异步action
 * @param {String}  type         action 类型
 * @param {Promise} fetchMethods 异步请求方法
 */
export const createAsyncAction = (type, fetchMethods) => {
  const startAction = createAction(type)
  const successAction = createAction(`${type}_${STATUS.SUCCESS}`)
  const failureAction = createAction(`${type}_${STATUS.FAILURE}`)

  // 经过中间件来实现状态分发
  return payload => (dispatch, getState) => {
    // 开始异步操作
    dispatch(startAction(payload))

    // 判断是否为Promise类型
    const promise = fetchMethods(payload)
    if (!isPromise(promise)) throw new Error('fetchMethods should be Promise')

    // 异步操作结束
    return promise
      .then(value => dispatch(successAction(value)))
      .catch(e => dispatch(failureAction(e)))
  }
}

// 创建 Reducer 实现类似 Promise的结构
export const createReducer = () => new ActionHandler()

// 判断是否为Promise
const isPromise = promise => promise && typeof promise.then === 'function'
