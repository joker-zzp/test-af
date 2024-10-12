import path from 'path/posix'
import { fs, readJsonData } from '../base'
import { baseConf } from '../conf'
import { logger } from '../log'
import { EXTENSION_TYPE, fileToExtensionName, logmark } from './base'
import { initInfo, queryInterface } from './data'
import { serverSendMsg } from './typeServer'
import { Base } from '..'
import { sendNotification } from '../notification'

export { progress as extensionProgress, eData as extensionData } from './data'

export { makeFunc } from './makePhase'
export * as Server from './typeServer'
export {
  queryLocalData,
  queryModuleData,
  updateInfo,
  updateSetting,
  queryProgress,
  removeInfo,
  removeProgress,
  queryInterface
} from './data'

export function init() {
  logger.info(logmark('init'), 'init extension')
  try {
    // 扩展文件夹是否存在 不存在创建 用于第一次安装 | 旧版本升级
    if (!fs.existsSync(baseConf.extensionDir)) {
      fs.mkdirSync(baseConf.extensionDir)
    }

    // 展开所有扩展类型进行文件夹内文件读取
    for (const tk in EXTENSION_TYPE) {
      const typeInfo = EXTENSION_TYPE[tk]
      // 扩展路径拼接
      const extensionPath = path.posix.join(baseConf.extensionDir, typeInfo.dir)
      logger.info(logmark('init'), `init ${typeInfo.name}`)
      // 判断其扩展文件夹是否存在 不存在创建
      if (!fs.existsSync(path.posix.join(extensionPath))) {
        // 创建文件夹 退出本次循环
        logger.info(logmark('init'), `create ${typeInfo.name} dir`)
        fs.mkdirSync(extensionPath)
        continue
      }
      // 其他类型跳过
      if (tk === 'other') continue
      // 读取文件夹内所有文件或文件夹
      fs.readdirSync(extensionPath, { withFileTypes: true })?.forEach((file) => {
        // 跳过备份文件或夹
        if (file.name.endsWith('.bak')) return
        // 跳过(特殊|隐藏)文件或夹
        if (/^[._~#!&$%^\\*]/.test(file.name)) return
        const extensionName = fileToExtensionName(file.name)
        logger.info(logmark('init'), `init ${typeInfo.name} ${extensionName}`)
        // 文件夹处理
        if (file.isDirectory()) {
          // TODO: 查找其下是否存在 setting.json 文件 将其合并到 数据中 setting.json
          const settingPath = path.posix.join(extensionPath, file.name, 'setting.json')
          // 判断是否存在 setting.json
          if (fs.existsSync(settingPath)) {
            initInfo({
              name: extensionName,
              type: typeInfo.name,
              ...readJsonData(settingPath)
            })
            return
          }
        }
        // 文件处理
        initInfo({ name: extensionName, type: typeInfo.name })
      })
    }
  } catch (e) {
    logger.error(logmark('init'), e)
  }
}

/** 调用扩展接口
 * 入口
 * @param event: 接口名
 * @param callback: 回调函数
 * @param ...args: 参数
 */
export function callInterface(event: string, ...args) {
  logger.info(Base.logmark.utils('callInterface'), `call interface ${event} args:`, args)
  // 查询接口信息
  const apiInfo = queryInterface({ event: event })
  logger.info(logmark('callInterface'), `interface info:`, apiInfo)
  if (apiInfo && !(apiInfo instanceof Array)) {
    // 根据接口类型调用对应接口
    let msg = {
      msgId: Base.getMsgId(),
      args: undefined
    }
    if (apiInfo.type === 'sendMsg') {
      if (args && args.length === 1) {
        msg = { ...msg, ...args[0] }
      }
      return serverSendMsg(apiInfo, msg, (data) => sendNotification(data))
    }
    // 事件 接口类型不支持
    logger.error(logmark('callInterface'), `interface ${event} type not supported`)
    throw new Error(`interface ${event} type not supported`)
  }
  // 接口信息不存在
  logger.error(logmark('callInterface'), `interface ${event} not found`)
  throw new Error(`no interface ${event}`)
}
