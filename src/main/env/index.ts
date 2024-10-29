import { app } from 'electron'
import { ExtensionData, ExtensionProgress } from '../util/extension/base'

/**
 * 配置文件数据类型
 * @param T 配置数据类型
 */
export type CFG<T = unknown> = {
  name: string
  module: string
  savePath?: string
  data: T
}

type AppData = {
  mainId: number | null
  readonly appConfig: {
    name: string
    version: string
    dev?: boolean
  }
  conf: CFG[]
}

export const conf: AppData['appConfig'] = {
  name: app.getName(),
  version: app.getVersion(),
  dev: true
}

export const appData: AppData = {
  mainId: null,
  appConfig: conf,
  conf: []
}

type SystemInfo = {
  // 系统
  system: string | null
  /** 操作系统 */
  platform: string | null
  /** 系统架构 */
  arch: string | null
  /** 系统版本 */
  version: string | null
  /** 语言 */
  language: string | null

  /** 用户名 */
  name: string | null
  /** 用户主目录 */
  home: string | null
  /** 用户文档目录 */
  document: string | null
  /** 下载目录 */
  dowmload: string | null
  /** 用户应用数据目录 */
  appdata: string | null
  /** 用户资源目录 */
  resource: string | null
  /** 用户配置目录 */
  configDir: string | null

  // 环境变量
  env: string[] | null
}

export const systemInfo: SystemInfo = {
  system: null,
  platform: null,
  arch: null,
  version: null,
  language: null,

  name: null,
  home: null,
  document: null,
  dowmload: null,
  appdata: null,
  resource: null,
  configDir: null,

  env: []
}

export const configDir: string | null = null
export const configPath: string | null = null

export const extensionData: ExtensionData[] = []
export const extensionProgress: ExtensionProgress[] = []
