import { app } from 'electron'
import { systemInfo } from '../env'
import { getUserInfo, pathFormat, systemArch, systemOs } from './base'

export const initSystemInfo = () => {
  const _s_info = {
    system: `${systemOs()}_${systemArch()}`,
    arch: systemArch(),
    platform: systemOs()
  }
  const _u_info = getUserInfo()

  systemInfo.system = _s_info.system
  systemInfo.arch = _s_info.arch
  systemInfo.platform = _s_info.platform
  systemInfo.name = _u_info.name
  systemInfo.home = _u_info.homePath

  systemInfo.appdata = pathFormat(app.getPath('appData'))
  systemInfo.document = pathFormat(app.getPath('documents'))
  systemInfo.dowmload = pathFormat(app.getPath('downloads'))
  systemInfo.language = app.getLocale()

  return void 0
}
