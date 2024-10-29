import { electronAPI } from '@electron-toolkit/preload'
import { MainEvent } from '../../main/event'

export const clientEvent = {
  send: (channel: keyof MainEvent['on'], ...args: Parameters<MainEvent['on'][typeof channel]>[1]) =>
    electronAPI.ipcRenderer.send(channel, ...args),
  invoke: (channel: keyof MainEvent['handle'], ...args) =>
    electronAPI.ipcRenderer.invoke(channel, ...args)
}

export type Client = typeof clientEvent
