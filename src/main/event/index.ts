import { ipcMain } from 'electron'
import { appInfo, getUserSystemInfo, setWinTitle } from './app/base'
import { onMessage } from './message'
import { getSettingInfo, getSettingList, setSettingInfo } from './app/setting'
import { doc } from './doc'

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
  'app::info': appInfo,
  'app::systemInfo': getUserSystemInfo,

  /** 文档 */
  'app::doc::rootDir': () => {},
  'app::doc::query': doc.base.search,
  'app::doc::create': doc.base.create,
  'app::doc::delete': doc.base.delete,

  /* 设置 */
  'app::setting::list': getSettingList,
  'app::setting::get': getSettingInfo,
  'app::setting::set': setSettingInfo
} as const

const ipcMainOn = {
  'app::base::setWinTitle': setWinTitle,
  /* 处理消息 */
  'app::message::receive': onMessage
} as const

export type MainEvent = {
  on: typeof ipcMainOn
  handle: typeof ipcMainHandler
}

export const initEvent = (): void => {
  Object.keys(ipcMainHandler).forEach((key) => {
    ipcMain.handle(key, ipcMainHandler[key])
  })
  Object.keys(ipcMainOn).forEach((key) => {
    ipcMain.on(key, ipcMainOn[key])
  })
}
