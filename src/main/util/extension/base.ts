import { systemInfo } from '../../env'
import { path } from '../base'

const EXTENSION_MODULE = 'extension'

/**
 * 扩展类型定义
 * @description 此配置 应与服务器端保持一致
 */
export const EXTENSION_TYPE = {
  other: {
    key: 0,
    dir: 'other',
    name: 'other'
  },
  /** 执行器 命令 */
  actuator: {
    key: 1,
    dir: 'actuator',
    name: 'acturator'
  },
  /** 插件 */
  plugin: {
    key: 2,
    dir: 'plugins',
    name: 'plugin'
  },
  /** 服务 */
  service: {
    key: 3,
    dir: 'services',
    name: 'service'
  }
} as const

// 扩展类型
export type ExtensionType = keyof typeof EXTENSION_TYPE

// 扩展接口
export type ExtensionInterface = {
  // 接口名称
  label?: string
  // 接口类型
  type: 'sendMsg' | 'exec' | 'data'
  // 触发事件
  event?: string
  // 触发状态
  state?: string
  // 参数
  params: {
    [k: string]: string | number | boolean | null | undefined
  }
}

export type InterfaceInfoType = {
  name: string
} & ExtensionInterface

/**
 * 扩展数据定义
 * @description 此配置为本地配置, 拥有服务端配置没有的字段
 */
export type ExtensionData = {
  id?: number
  /** 名称 */
  name: string
  // 扩展类型
  type: ExtensionType
  // 扩展路径
  path?: string
  // 是否启用
  enable: boolean
  // 展示home看板
  showHome: boolean
  // 状态 已停止 其他状态
  state?: string | 'stopped'
  // 版本
  version?: string
  // 介绍
  description?: string
  // 作者
  author?: string
  // icon
  icon?: string
  baseConfig?: {
    // 界面配置
    viewData?
    // 对外接口
    provide?: ExtensionInterface[]
  }
  // 设置
  settings?: { [key: string]: string | boolean | number | object | null | undefined }
}

// 扩展进度类型
export type ExtensionProgress = {
  name: string
  // 类型 安装\卸载\更新
  type: 'install' | 'uninstall' | 'update'
  url?: string
  // 进度 0-100
  progress: number
  // 状态
  status: 'init' | 'processing' | 'success' | 'error' | 'cancel'
  // 阶段 下载 安装 删除 结束
  phase: 'download' | 'install' | 'remove' | 'conf' | 'end'
  // 是否需要解压
  needUnzip: boolean
  // 是否需要重启
  needRestart: boolean
  // 是否需要重置配置
  needResetConfig: boolean
  // 附加配置
  extraConfig?: object
  // 临时路径 (下载中)
  tmpPath?: string
  // 输出路径
  outPath?: string
}

export function fileToExtensionName(fileName: string) {
  return fileName.replace(/\.bat$|\.exe$|\.sh$/, '')
}

/** 扩展文件夹 */
export const extensionDir = (type: ExtensionType) => {
  if (!systemInfo.appdata) {
    throw new Error('appdata not found')
  }
  return path.posix.join(systemInfo.appdata, EXTENSION_MODULE, type)
}

/** 扩展设置注册 -> appdata.conf */

/** 取消扩展设置注册 */

/** 下载扩展 */
