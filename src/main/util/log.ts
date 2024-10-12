import log from 'electron-log/main'
// import { path } from './base'
import { is } from '@electron-toolkit/utils'

export function loginit() {
  log.transports.file.level = 'info'
  log.transports.file.fileName = 'main.log'
  log.transports.console.level = false
  // log.transports.file.resolvePathFn = () => path.posix.join(baseConf.logDir, 'main.log')
  // 日志大小设置
  log.transports.file.maxSize = 1024 * 1024 * 10 // 10MB
  // log.transports.file.maxSize = 1024
  // 日志格式化
  log.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{text}'
}

export const logger = {
  info: is.dev ? console.info : log.info,
  error: is.dev ? console.error : log.error,
  warn: is.dev ? console.warn : log.warn,
  debug: is.dev ? console.debug : log.debug,
  log: is.dev ? console.log : log.log
}
