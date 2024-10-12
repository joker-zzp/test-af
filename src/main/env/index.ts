type AppData = {
  mainId: number | null
}

export const appData: AppData = {
  mainId: null
}
export const conf = {
  appName: 'my-app',
  version: '1.0.0-beta'
}

type SystemInfo = {
  // 系统
  system: string | null
  /** 操作系统 */
  platform: string | null
  /** 系统架构 */
  arch: string | null
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

  // 环境变量
  env: string[] | null
}

export const systemInfo: SystemInfo = {
  system: null,
  platform: null,
  arch: null,
  language: null,

  name: null,
  home: null,
  document: null,
  dowmload: null,
  appdata: null,
  resource: null,

  env: []
}
