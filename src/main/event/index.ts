import { ipcMain } from 'electron'
import { appInfo, getUserSystemInfo, setWinTitle } from './app/base'
import { onMessage } from './message'

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
    version: '1.0.0-beta'
  }
}

const ipcMainHandler = {
  'app-info': appInfo,
  'system-info': getUserSystemInfo
}

const ipcMainOn = {
  'app-setTitle': setWinTitle,
  /* 接收消息 */
  'IPC-onMessage': onMessage
}

export const initEvent = (): void => {
  Object.keys(ipcMainHandler).forEach((key) => {
    ipcMain.handle(key, ipcMainHandler[key])
  })
  Object.keys(ipcMainOn).forEach((key) => {
    ipcMain.on(key, ipcMainOn[key])
  })
}
