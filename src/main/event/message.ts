import { BrowserWindow } from 'electron'
import { appData } from '../env'

/** 发送消息
 * @description
 * 客户端 -> 渲染器 send 消息
 * @param msg 消息内容
 */
export const sendMessage = (msg): void => {
  // 获取主窗口的webContents
  const allWindows = BrowserWindow.getAllWindows()
  const win = allWindows.find((w) => w.id === appData.mainId)
  if (win) {
    win.webContents.send('ipcRenderer-message-send', msg)
  } else {
    console.log('主窗口未创建')
  }
}

/** 收到消息
 * @description
 * 渲染器 -> 客户端 receive 消息
 * @param event 事件
 * @param msg 消息内容
 */
export const onMessage = (event, msg) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  // 告诉渲染器收到消息
  if (win) {
    win.webContents.send('ipcRenderer-message-reply', msg)
  }
  // 处理消息
  console.log('收到消息', msg)
}
