/* eslint-disable @typescript-eslint/no-explicit-any */
import { BrowserWindow, ipcMain, ipcRenderer } from 'electron'
import { systemArch, systemOs } from './utils/base'

/** 客户端配置数据 */
export const config = {
  /** 是否进行调试 */
  debug: false,
  /** 是否开启日志 */
  log: false,
  /** 应用信息 */
  app: {
    /** 应用名称 */
    name: 'test-af',
    /** 应用版本 */
    version: '1.0.0',
    /** 当前系统 架构 */
    os: `${systemOs()}_${systemArch()}`
  }
}

/** 事件 */
export const event = {
  'app-init': {
    type: 'func',
    count: 1,
    exec: (): void => {
      console.log('app-init')
    }
  },
  'app-setting-set': {
    type: 'ipcMain-handler',
    exec: (event, key: string, value): void => {
      if (!event) return
      console.log('app-setting', event.sender.id, key, value)
    }
  },
  'app-setting-get': {
    type: 'ipcMain-handler',
    exec: async (event): Promise<typeof config> => {
      console.log('app-setting-get', event.sender.id)
      return config
    }
  }
}

type EventFunc<T extends (event: Electron.IpcMainEvent, ...args: any[]) => any> = T extends (
  event: Electron.IpcMainEvent,
  ...args: infer P
) => infer R
  ? (...args: P) => R
  : never

export type Event = {
  'app-setting-set': {
    type: 'ipcRenderer-handler'
    func: EventFunc<(typeof event)['app-setting-set']['exec']>
  }
  'app-setting-get': {
    type: 'ipcMain-handler'
    func: EventFunc<(typeof event)['app-setting-get']['exec']>
  }
}

export const Appinit = (): void => {
  Object.keys(event).forEach((key) => {
    const { type, exec } = event[key]
    if (type === 'func') {
      exec()
      return
    }
    if (type === 'ipcMain-handler') {
      return ipcMain.handle(key, (event, ...args) => exec(event, ...args))
    }
    if (type === 'ipcMain-on') {
      ipcMain.on(key, (event, ...args) => exec(event, ...args))
      return
    }
  })
}
