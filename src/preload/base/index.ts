import { electronAPI } from '@electron-toolkit/preload'
import { MainEvent } from '../../main/event'

export const clientEvent = {
  on: (
    channel: keyof MainEvent['on'],
    callback: (...args) => void
  ): MainEvent['on'][typeof channel] => electronAPI.ipcRenderer.on(channel, callback),
  invoke: (
    channel: keyof MainEvent['handle'],
    ...args
  ): Promise<MainEvent['handle'][typeof channel]> =>
    electronAPI.ipcRenderer.invoke(channel, ...args)
}

export type Client = typeof clientEvent
