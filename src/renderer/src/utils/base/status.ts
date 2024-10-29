import { createContext } from 'react'
import { logger } from './log'

export type EventFunc<K extends string, T> = {
  [k in K]: (state: T, payload?) => Partial<T> | void
}

/** 创建 reducer 和 context
 *
 * @param reducerMap 事件映射方法 -> eventFunc
 * @param initState 初始化状态 -> initState
 * @returns [Reducer, Context]
 * @example
 * ```ts
 * const [Reducer, Context] = createReducerContext({
 *   event: (state, payload) => ({ ...state, ...payload }),
 *   'init::abc': (state, payload) => {
 *      // TODO: ...
 *      // state = { a: payload.a, b: payload.b } // 初始化状态
 *      return state
 *    },
 *   'update::abc': (state, payload) => {
 *      // TODO: ...
 *      // error: throw new Error('各种问题')
 *
 *      // 更新新字段
 *      return { ...update }
 *    },
 *    'event::abc': (state, payload) => {
 *      // TODO: ...
 *      // error: throw new Error('各种问题')
 *      // 静默处理 无返回值
 *      return void
 *    }
 * }, { a: 1, b: 2 }, 'mark')
 * ```
 */
export function createReducerContext<K extends string, T>(
  reducerMap: {
    [k in K]+?: (state: T, payload?) => Partial<T> | void | never
  },
  initState: T,
  logmark?: string
) {
  type RA = {
    event: K
    payload?
  }
  const reducer = (state: T, action: RA): T => {
    const { event, payload } = action
    // 事件触发 防止出现异常
    try {
      // console.debug(mark('Reducer', event), payload)
      // 未传递事件 返回原状态
      if (!event) return state
      // 事件不存在 返回原状态
      if (!(event in reducerMap)) return state
      if (reducerMap[event]) {
        // 执行事件方法
        logger.info(`${logmark || ''}[Reducer:: ${event}]:`, payload)
        const res = reducerMap[event](state, payload)
        // 没有更新 返回原状态
        if (!res) return state
        // 有更新 - 通过重新迭代到新对象 会触发 useff 监听
        return { ...state, ...res }
      } else {
        // 事件丢失
        return state
      }
    } catch (error) {
      logger.error(`${logmark || ''}[Reducer:: ${event}]:`, String(error))
      // 出现异常状态不动
      return state
    }
  }
  const context = createContext<{
    state: T
    dispatch: (action: RA) => void
  }>({
    state: initState,
    dispatch: () => null
  })
  return [reducer, context] as const
}

// 示例
// type StateABC = {
//   a: number | null
//   b: number | null
//   c: number | null
// }

// const initABC: StateABC = {
//   a: null,
//   b: null,
//   c: null
// }

// const reducerMapABC = {
//   'init::abc': (state, payload) => {
//     state.a = payload.a
//     state.b = payload.b
//     state.c = payload.c
//     return state
//   }
// }

// const [reducer, context] = createReducerContext(reducerMapABC, initABC, 'ABC')
