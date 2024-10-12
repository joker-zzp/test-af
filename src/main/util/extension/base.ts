import { Base } from '..'

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
  actuator: {
    key: 1,
    dir: 'actuator',
    name: 'acturator'
  },
  plugin: {
    key: 2,
    dir: 'plugins',
    name: 'plugin'
  },
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
  label: string
  type: 'sendMsg' | 'exec' | 'data'
  event?: string
  state?: string
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

export const logmark = (...ks: string[]) => Base.logmark.utils('extension', ...ks)
