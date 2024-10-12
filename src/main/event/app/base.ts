import { BrowserWindow } from 'electron'
import { systemArch, systemOs, getUserInfo } from '../../util/base'
import { conf, systemInfo } from '../../env'

export const appInfo = () => {
  return {
    name: conf.appName,
    version: conf.version,
    systemOs: `${systemOs()}_${systemArch()}`
  }
}

const checkFunc = [
  {
    key: 'systemCheck',
    verify: () => systemInfo.system === `${systemOs()}_${systemArch()}`,
    msg: '系统检测异常'
  },
  {
    key: 'nameCheck',
    verify: () => systemInfo.name === getUserInfo().name,
    msg: '用户信息异常'
  }
]

export const getUserSystemInfo = () => {
  for (const item of checkFunc) {
    if (!item.verify()) {
      throw new Error(item.msg)
    }
  }
  return systemInfo
}

export const setWinTitle = (event, title?: string) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  if (title) {
    win?.setTitle(`${conf.appName} - ${title}`)
  } else {
    win?.setTitle(conf.appName)
  }
}
