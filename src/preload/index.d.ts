// import { ElectronAPI } from '@electron-toolkit/preload'
import { Client } from './base'

declare global {
  interface Window {
    // electron: ElectronAPI
    clientEvent: Client
  }
}
