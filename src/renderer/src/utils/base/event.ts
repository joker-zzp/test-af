import { logger } from './log'

/** 创建事件
 * @param eventDict 事件字典
 * @param logmark 日志标记
 * @example
 * ```ts
 * const triggerEvent = createEvent({
 *   test: () => {
 *     console.log('test')
 *   },
 * }, '[Utils]')
 * ```
 */
export function createEvent<
  K extends string,
  T extends {
    [k in K]: (...args) => ReturnType<T[k]>
  }
>(eventDict: T, logmark: string) {
  type EventKey = Extract<keyof T, string>
  type EventParams = Parameters<T[EventKey]>
  type EventReturn = ReturnType<T[EventKey]> | void
  return (event: EventKey, ...args: EventParams): EventReturn => {
    if (Object.prototype.hasOwnProperty.call(eventDict, event)) {
      try {
        logger.info(logmark, `[Event-run:: ${event}]:`, args)
        return eventDict[event](...args)
      } catch (error) {
        logger.error(logmark, `[Event-Error:: ${event}]:`, String(error))
        return
      }
    }
    logger.warn(logmark, `[Event-warning:: ${event}] "${event}" is not defined in eventDict.`)
    return
  }
}

// 使用示例
// const triggerEvent = createPageEvent(
//   {
//     /** test */
//     test: () => {
//       console.log('test')
//     },
//     init: (params: string) => {
//       console.log('init', params)
//       return 0
//     }
//   },
//   '[Utils]'
// )

export const MainEvent = window.clientEvent
