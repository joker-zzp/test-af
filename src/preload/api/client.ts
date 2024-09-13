import { ipcRenderer } from 'electron'
import { Event } from '../../main/event/index'

/** 页面事件 */
type PageEvent = {
  [key in keyof Event]: (...args: Parameters<Event[key]['func']>) => ReturnType<Event[key]['func']>
}

export const client = {
  invoke: (
    k: keyof Event,
    ...args: Parameters<Event[keyof Event]['func']>
  ): ReturnType<typeof ipcRenderer.invoke> => {
    return ipcRenderer.invoke(k, ...args)
  },
  on: (k: keyof Event, cb: (...args) => void): Electron.IpcRenderer => {
    return ipcRenderer.on(k, cb)
  }
}
