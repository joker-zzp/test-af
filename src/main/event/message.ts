import { BrowserWindow } from 'electron'

export const sendMessage = (event, msg): void => {
  const win = BrowserWindow.fromWebContents(event.sender)
  win?.webContents.send('ipcMain-message', msg)
}
