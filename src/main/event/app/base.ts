import { BrowserWindow } from 'electron'
import { systemArch, systemOs } from '../../util/base'
import { conf } from '../../env'

export const appInfo = () => {
  return {
    systemOs: `${systemOs()}_${systemArch()}`
  }
}

export const setWinTitle = (event, title?: string) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  if (title) {
    win?.setTitle(`${conf.appName} - ${title}`)
  } else {
    win?.setTitle(conf.appName)
  }
}
