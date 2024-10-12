import path from 'path/posix'
import { addExecutable, downloadFile, extractZipFile, fs, isFile, replacePercent, systemOs } from '../base'
import { logger } from '../log'
import { EXTENSION_TYPE, ExtensionData, ExtensionProgress, logmark } from './base'
import { initInfo } from './data'
import { extensionData, extensionProgress } from './index'
import { baseConf, confRootDir } from '../conf'
import { publicData } from '..'

// 任务
// const worktask = []

/**
 * 检查方法
 */
const checkFunc = {
  exist: (params, msg?: string) => {
    if (extensionProgress[params?.name] !== undefined) {
      throw new Error(`check:exist: ${msg || '数据已存在'}`)
    }
  },
  notExist: (params, msg?: string) => {
    checkFunc.paramsNameMiss(params, msg)
    if (extensionData.findIndex((item) => item.name === params.name) === -1) {
      throw new Error(`check:notExist: ${msg || '数据不存在'}`)
    }
  },
  paramsUrlMiss: (params, msg?: string) => {
    if (!params.url) throw new Error(`check:paramsUrlMiss: ${msg || 'url参数缺失'}`)
  },
  paramsNameMiss: (params, msg?: string) => {
    if (!params.name) throw new Error(`check:paramsNameMiss: ${msg || 'name参数缺失'}`)
  },
  paramsTmpPathMiss: (params, msg?: string) => {
    if (!params.tmpPath) throw new Error(`check:tmpPathMiss: ${msg || '临时文件路径缺失'}`)
  }
} as const

// type CheckType = { [k in keyof typeof checkFunc]+?: string | undefined }

function initProgressData(
  params: { name: string; type: ExtensionData['type']; url?: string },
  progressType: ExtensionProgress['type']
) {
  extensionProgress[params.name] = {
    name: params.name,
    type: progressType,
    url: params.url,
    progress: 0,
    status: 'init',
    phase: 'download',
    needUnzip: false,
    needRestart: false,
    needResetConfig: false
  }
  if (progressType === 'install' || progressType === 'update') {
    // 设置路径 根据url搞成路径
    if (extensionProgress[params.name].url) {
      const dFileName = params.url?.split('/').pop() || params.name
      extensionProgress[params.name].tmpPath = path.posix.join(baseConf.tmpDir, dFileName)
      extensionProgress[params.name].needUnzip = dFileName.endsWith('.zip') ? true : false
    }
    // windows
    let _extensionName = params.name
    if (systemOs() === 'Windows') {
      if (params.type === 'service') {
        _extensionName = `${params.name}.exe`
      }
    }
    // 设置输出路径
    extensionProgress[params.name].outPath = path.posix.join(
      path.posix.normalize(baseConf.extensionDir),
      EXTENSION_TYPE[params.type].dir,
      _extensionName
    )
    return
  }
  if (progressType === 'uninstall') {
    extensionProgress[params.name].phase = 'remove'
  }
}

function downloadTask(name: string) {
  // 获取其url
  checkFunc.paramsUrlMiss(extensionProgress[name], '下载地址未设置')
  checkFunc.paramsTmpPathMiss(extensionProgress[name], '下载地址未设置')
  // 下载进度上限
  const downMaxProgress = extensionProgress[name].needUnzip ? 95 : 99
  // 下载
  downloadFile(
    extensionProgress[name].url as string,
    {
      'User-Agent': publicData.app.userAgent as string
    },
    extensionProgress[name].tmpPath as string,
    (resData) => {
      // 更新进度数据
      extensionProgress[name].progress = replacePercent(resData.dx, resData.total, downMaxProgress)
      // 100 时完成 否则 进行中
      extensionProgress[name].status = resData.progress === 100 ? 'success' : 'processing'
      if (resData.status === 'end') {
        if (resData.error) {
          // 下载失败
          logger.error(logmark('downloadTask'), resData?.error)
          extensionProgress[name].status = 'error'
          return
        }
      }
    }
  )
}

/**
 * 阶段方法
 */
const phaseFunc: { [k in ExtensionProgress['type']]: (...args) => void } = {
  install: (...args) => {
    logger.info(logmark('phaseFunc', 'install'), 'args:', args)
    // 是否需要解压
    const name = args[0]
    const pInfo = extensionProgress[name]
    if (!name) throw new Error('install: name 参数缺失')
    if (!pInfo) throw new Error('install: 数据不存在')
    if (pInfo.phase !== 'install') throw new Error('install: phase 参数错误')
    if (!pInfo.tmpPath) throw new Error('install: 临时文件路径不存在')
    if (!pInfo.outPath) throw new Error('install: 输出路径不存在')
    // 安装阶段
    if (pInfo.status === 'success') {
      // 进入设置信息阶段
      pInfo.phase = 'conf'
      pInfo.status = 'init'
      return
    }
    if (pInfo.status !== 'init') return
    if (pInfo.needUnzip) {
      // 解压
      extractZipFile(pInfo.tmpPath, pInfo.outPath, (resData) => {
        // 更新进度 95-100 解压进度
        pInfo.status = 'processing'
        pInfo.progress = 95 + replacePercent(resData.ex, resData.total, 4)
        // 解压结束
        if (resData.status === 'end') {
          // pInfo.phase === 'end'
          if (resData.error) {
            pInfo.status = 'error'
            pInfo.phase = 'end'
            throw resData.error
          } else {
            pInfo.status = 'success'
          }
        }
      })
      return
    }
    // 直接复制
    fs.renameSync(pInfo.tmpPath, pInfo.outPath)
    pInfo.status = 'success'
  },
  uninstall: (...args) => {
    logger.info(logmark('phaseFunc', 'uninstall'), 'args:', args)
    const name = args[0]
    const infoIndex = extensionData.findIndex((item) => item.name === name)
    if (infoIndex === -1) throw new Error('uninstall: 扩展不存在')
    const infoData = extensionData[infoIndex]
    if (infoData.state !== 'stopped' && infoData.state !== undefined) {
      throw new Error('uninstall: 扩展未停止')
    }
    if (!infoData.path) {
      throw new Error('uninstall: 扩展路径不存在')
    }
    const pInfo = extensionProgress[name]
    if (!pInfo) throw new Error('uninstall: 数据不存在')
    if (pInfo.phase !== 'remove') throw new Error('uninstall: phase 参数错误')
    if (pInfo.status !== 'init') return
    // 删除配置文件
    const configPath = path.posix.join(confRootDir(), `${pInfo.name}.json`)
    if (fs.existsSync(configPath)) {
      fs.rmSync(configPath)
    }
    // 删除扩展
    fs.rmSync(infoData.path, { recursive: true })
    pInfo.status = 'success'
    pInfo.phase = 'end'
    // 删除扩展配置数据
    extensionData.splice(infoIndex)
    // 设置进度100
    pInfo.progress = 100
  },
  update: (...args) => {
    logger.info(logmark('phaseFunc', 'update'), 'args:', args)
    const name = args[0]
    const pInfo = extensionProgress[name]
    const infoIndex = extensionData.findIndex((item) => item.name === name)
    // 查找其扩展是否存在
    if (infoIndex === -1) {
      throw new Error('update: 扩展不存在')
    }
    const infoData = extensionData[infoIndex]
    // 检查是否为停止状态
    if (!(infoData.state === 'stopped' || infoData.state === undefined)) {
      logger.error(logmark('phaseFunc', 'update'), 'state', infoData.state)
      throw new Error('update: 扩展未停止')
    }
    if (pInfo.phase !== 'install') throw new Error('update: phase 参数错误')
    if (!pInfo.tmpPath) throw new Error('update: 临时文件路径不存在')
    if (!pInfo.outPath) throw new Error('update: 输出路径不存在')
    if (!infoData.path) throw new Error('update: 扩展路径不存在')
    // 安装阶段
    if (pInfo.status === 'success') {
      // 进入设置信息阶段
      pInfo.phase = 'conf'
      pInfo.status = 'init'
      return
    }
    // 非初始化状态跳过
    if (pInfo.status !== 'init') return
    // 先备份扩展
    if (fs.existsSync(infoData.path)) {
      // 查看备份扩展是否存在
      if (fs.existsSync(infoData.path + '.bak')) {
        // 删除备份扩展
        fs.rmSync(infoData.path + '.bak', { recursive: true })
      }
      // 备份扩展
      fs.renameSync(infoData.path, pInfo.outPath + '.bak')
      // 检查备份文件是否存在
      if (!fs.existsSync(pInfo.outPath + '.bak')) {
        throw new Error('update: 备份扩展失败')
      }
    }
    // 解压扩展
    if (pInfo.needUnzip) {
      extractZipFile(pInfo.tmpPath, pInfo.outPath, (resData) => {
        pInfo.status = 'processing'
        pInfo.progress = 95 + replacePercent(resData.ex, resData.total, 4)
        if (resData.status === 'end') {
          if (resData.error) {
            pInfo.status = 'error'
            pInfo.phase = 'end'
            logger.error(logmark('extractZipFile', 'callback'), resData.error)
            // 还原备份扩展
            if (fs.existsSync(pInfo.outPath + '.bak')) {
              // 删除当前已解压的文件
              fs.rmSync(pInfo.outPath as string, { recursive: true })
              // 恢复备份扩展
              fs.renameSync(pInfo.outPath + '.bak', infoData.path as string)
            }
            throw resData.error
          } else {
            pInfo.status = 'success'
          }
        }
      })
      return
    }
    // 直接复制
    fs.copyFileSync(pInfo.tmpPath, pInfo.outPath)
    pInfo.status = 'success'
  }
}

function makePhase(name: string, timerId: ReturnType<typeof setInterval>, args?: unknown[]) {
  const pInfo = extensionProgress[name]
  // 进度数据不存在 停止
  if (!pInfo) {
    clearInterval(timerId)
    return
  }
  logger.info(logmark('makePhase'), `${name}: ${pInfo.phase}`, pInfo.status)
  try {
    if (pInfo.phase === 'end') {
      if (pInfo.tmpPath && fs.existsSync(pInfo.tmpPath)) {
        // 删除临时文件
        fs.rmSync(pInfo.tmpPath, { recursive: true, force: true })
      }
      logger.info(logmark('makePhase'), `end`, name)
      // 清除定时器
      clearInterval(timerId)
      return
    }
    if (pInfo.phase === 'download') {
      // 下载进行时
      if (pInfo.status === 'processing') {
        return
      }
      // 下载初始化
      if (pInfo.status === 'init') {
        // 创建个下载任务
        downloadTask(name)
        pInfo.status = 'processing'
        return
      }
      // 下载完成
      if (pInfo.status === 'success') {
        pInfo.phase = 'install'
        pInfo.status = 'init'
        return
      }
      // 下载失败 或取消
      if (pInfo.status === 'error' || pInfo.status === 'cancel') {
        pInfo.phase = 'end'
        return
      }
    }
    if (pInfo.phase === 'install' || pInfo.phase === 'remove') {
      try {
        phaseFunc[pInfo.type](pInfo.name)
      } catch (error) {
        logger.error(logmark('makePhase', pInfo.phase), error)
        pInfo.status = 'error'
        pInfo.phase = 'end'
      }
    }
    if (pInfo.phase === 'conf') {
      // 设置配置
      if (pInfo.status === 'init') {
        // 赋予可执行权限
        if (pInfo.type === 'install' || pInfo.type === 'update') {
          if (isFile(pInfo.outPath as string)) {
            addExecutable(pInfo.outPath as string)
          }
        }
        // 更新配置
        if (args) {
          const otherParams = args[0] as ExtensionData
          const reset = Boolean(args[1]) || false
          const settings = {}
          if (otherParams.baseConfig?.viewData?.showSettings instanceof Array) {
            // 循环设置 将带有默认值的数据添加到settings中
            for (const item of otherParams.baseConfig.viewData.showSettings) {
              if (item.default) {
                settings[item.key] = item.default
              }
            }
          }
          initInfo({ path: pInfo.outPath, ...otherParams, settings: settings }, reset)
        }
        pInfo.status = 'success'
        pInfo.progress += 1
        pInfo.phase = 'end'
        return
      }
      return
    }
  } catch (error) {
    logger.error(logmark('makePhase'), error)
    pInfo.status = 'error'
    pInfo.phase = 'end'
  }
}

// type MakePhaseParams = {
//   name: string
// }
export const makeFunc = {
  /** 安装扩展
   * @param params { name: string }
   * @returns Promise<ExtensionProgress>
   */
  install: async (params): Promise<ExtensionProgress> => {
    logger.info(logmark('makeFunc', 'install'), 'params:', params)
    return new Promise((resolve, reject) => {
      // 参数检查
      try {
        logger.info(logmark('makeFunc', 'install'), extensionProgress[params.name])
        for (const [key, msg] of Object.entries({
          exist: '扩展正在安装',
          paramsNameMiss: '扩展名称不能为空',
          paramsUrlMiss: '扩展地址不能为空'
        })) {
          checkFunc[key](params, msg)
        }
        // 初始化进度数据
        initProgressData(
          {
            name: params.name,
            type: params.type,
            url: params.url
          },
          'install'
        )
        // managePhase
        const timer = setInterval(() => makePhase(params.name, timer, [params]), 20)
        resolve(extensionProgress[params.name])
      } catch (error) {
        logger.error(logmark('makeFunc', 'install'), error)
        reject(error)
      }
    })
  },
  /** 更新扩展 */
  update: async (params): Promise<ExtensionProgress> => {
    logger.info(logmark('makeFunc', 'update'), 'params:', params)
    return new Promise((resolve, reject) => {
      try {
        for (const [key, msg] of Object.entries({
          exist: '扩展正在更新',
          paramsNameMiss: '扩展名称不能为空',
          paramsUrlMiss: '扩展地址不能为空'
        })) {
          checkFunc[key](params, msg)
        }
        // 初始化进度数据
        initProgressData(
          {
            name: params.name,
            type: params.type,
            url: params.url
          },
          'update'
        )
        // managePhase
        const timer = setInterval(() => makePhase(params.name, timer, [params]), 20)
        resolve(extensionProgress[params.name])
      } catch (error) {
        logger.error(logmark('makeFunc', 'update'), error)
        reject(error)
      }
    })
  },
  /** 卸载扩展 */
  uninstall: async (params): Promise<ExtensionProgress> => {
    logger.info(logmark('makeFunc', 'uninstall'), 'params:', params.name)
    return new Promise((resolve, reject) => {
      try {
        for (const [key, msg] of Object.entries({
          paramsNameMiss: '扩展名称不能为空',
          notExist: '扩展不存在'
        })) {
          checkFunc[key](params, msg)
        }
        const dataIndex = extensionData.findIndex((item) => item.name === params.name)
        initProgressData(
          {
            name: params.name,
            type: extensionData[dataIndex].type
          },
          'uninstall'
        )
        // managePhase
        const timer = setInterval(() => makePhase(params.name, timer), 20)
        resolve(extensionProgress[params.name])
      } catch (error) {
        logger.error(logmark('makeFunc', 'uninstall'), error)
        reject(error)
      }
    })
  }
} as const
