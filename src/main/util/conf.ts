import { appData, CFG, systemInfo } from '../env'
import { fs, path, pathFormat, readJsonData, writeJsonData } from './base'

const confFile = 'settings.json'

// export const configDir = () => {
//   const confDir = 'conf'
//   if (!systemInfo?.appdata) {
//     throw new Error('appdata is not defined')
//   }
//   return path.posix.join(systemInfo.appdata, confDir)
// }

// const configPath = () => {
//   if (!systemInfo.appdata) {
//     throw new Error('appdata is not defined')
//   }
//   const _confDir = configDir()
//   return path.posix.join(_confDir, confFile)
// }

type ConfigSettings = {
  [key: string]: string | number | null
}

const confInfo: CFG<ConfigSettings> = {
  // 默认配置
  name: 'app::settings',
  module: 'settings',
  savePath: undefined,
  data: {
    documents: null,
    downloads: null
  }
}

/** 获取配置 */
export const getConfig = (name?: string): CFG | CFG[] => {
  if (name) {
    const _cfg = appData.conf.find((i) => i.name === name)
    if (_cfg) {
      return _cfg
    } else {
      throw new Error('config is not defined')
    }
  }
  return appData.conf
}

/** 设置配置
 *
 * @param name 配置名称
 * @param key 配置key
 * @param value 配置值
 */
export const setConfig = (name: string, key: string, value) => {
  // 查找配置
  const _fic = appData.conf.find((i) => i.name === name)
  if (!_fic) {
    throw new Error('config is not defined')
  }
  if (!_fic.data) {
    throw new Error('config data is not defined')
  }
  _fic.data[key] = value
  // 保存配置
  if (_fic.savePath && fs.existsSync(_fic.savePath)) {
    writeJsonData(_fic.savePath, _fic.data, { spaces: 2 })
  }
}

/** 初始化配置 */
export const initConfig = () => {
  if (!systemInfo.configDir) {
    return void 0
  }
  // check confdir
  if (!fs.existsSync(systemInfo.configDir)) {
    fs.mkdirSync(systemInfo.configDir)
  }
  confInfo.savePath = pathFormat(path.posix.join(systemInfo.configDir, confFile))

  // 默认配置
  const defaultConfig = {
    documents: systemInfo.document && pathFormat(systemInfo.document),
    downloads: systemInfo.dowmload && pathFormat(systemInfo.dowmload)
  }

  // 如果配置文件不存在，则创建一个
  if (!fs.existsSync(confInfo.savePath)) {
    writeJsonData(confInfo.savePath, defaultConfig, { spaces: 2 })
    confInfo.data = defaultConfig
    appData.conf.push(confInfo)
    return void 0
  } else {
    // 如果配置文件存在，则读取配置文件
    const _conf = readJsonData<ConfigSettings>(confInfo.savePath)
    confInfo.data = { ...defaultConfig, ..._conf }
    const _f_c = appData.conf.find((i) => i.name === confInfo.name)
    if (_f_c) {
      _f_c.data = confInfo.data
      if (confInfo.data.documents) {
        systemInfo.document = confInfo.data.documents as string
      }
    } else {
      appData.conf.push(confInfo)
    }
  }
}
