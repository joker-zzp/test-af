import { app } from 'electron'
import { systemInfo } from '../env'
import { getUserInfo, path, pathFormat, systemArch, systemOs, systemVersion } from './base'
import { initConfig } from './conf'

export const initSystemInfo = () => {
  const _s_info = {
    system: `${systemOs()}_${systemArch()}`,
    arch: systemArch(),
    platform: systemOs(),
    version: systemVersion()
  }
  const _u_info = getUserInfo()

  systemInfo.system = _s_info.system
  systemInfo.arch = _s_info.arch
  systemInfo.platform = _s_info.platform
  systemInfo.version = _s_info.version
  systemInfo.name = _u_info.name
  systemInfo.home = _u_info.homePath

  systemInfo.appdata = pathFormat(app.getPath('userData'))
  systemInfo.document = pathFormat(path.posix.join(app.getPath('documents'), app.getName()))
  systemInfo.dowmload = pathFormat(app.getPath('downloads'))
  systemInfo.language = app.getLocale()

  // 设置文件夹
  systemInfo.configDir = pathFormat(path.posix.join(systemInfo.appdata, 'conf'))

  initConfig()
  // 初始化配置文件
  return void 0
}
