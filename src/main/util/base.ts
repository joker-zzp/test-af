import { is } from '@electron-toolkit/utils'
import { BrowserWindow } from 'electron'
import * as fs from 'fs'
import * as os from 'os'
import * as http from 'http'
import path from 'path'
import { randomUUID } from 'crypto'

export { path }

/** 读取json数据 */
export function readJsonData(filePath: string): unknown {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

/** 写入json数据 */
export function writeJsonData(
  filePath: string,
  data: object,
  options?: {
    spaces?: number | string
    replacer?: (number | string)[] | null
  }
): void {
  const _conf = {
    spaces: 2,
    replacer: null,
    ...options
  }
  fs.writeFileSync(filePath, JSON.stringify(data, _conf.replacer, _conf.spaces), 'utf8')
}

type OsType = 'MacOs' | 'Windows' | 'Linux' | 'unknown'
/** 系统类型
 * @returns 'MacOs' | 'Windows' | 'Linux' | 'unknown'
 */
export function systemOs(): OsType {
  switch (os.platform()) {
    case 'darwin':
      return 'MacOs'
    case 'win32':
      return 'Windows'
    case 'linux':
      return 'Linux'
    default:
      return 'unknown'
  }
}

type OsArch = 'x64' | 'arm' | 'arm64' | 'unknown'
/** 系统架构
 * @returns 'x64' | 'ia32' | 'arm' | 'arm64' | 'unknown'
 */
export function systemArch(): OsArch {
  switch (os.arch()) {
    case 'x64':
      return 'x64'
    case 'arm':
      return 'arm'
    case 'arm64':
      return 'arm64'
    default:
      return 'unknown'
  }
}

/** 获取用户信息 */
export function getUserInfo() {
  const _userInfo = os.userInfo()
  return {
    gid: _userInfo.gid,
    name: _userInfo.username,
    homePath: pathFormat(_userInfo.homedir)
  }
}

/** 路径格式化 */
export function pathFormat(filePath: string): string {
  return path.posix.normalize(filePath)
}

/** 给文件添加可执行权限 */
export function addExecutable(filePath: string) {
  if (systemOs() === 'Windows') {
    return
  }
  fs.chmodSync(filePath, 0o755)
}

/** 创建子窗口 */
export function createChildWindow(father, url: string) {
  const childWindow = new BrowserWindow({
    width: father.width,
    height: father.height,
    show: false,
    // parent: param,
    autoHideMenuBar: true,
    minHeight: 800,
    minWidth: 1000,
    icon: path.join(__dirname, 'build/af-client.png'),
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  childWindow.setBackgroundColor('#000000')
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    const baseurl = url
      ? `${process.env['ELECTRON_RENDERER_URL']}/#${url}`
      : process.env['ELECTRON_RENDERER_URL']
    childWindow.webContents.loadURL(baseurl)
  } else {
    childWindow.webContents.loadFile(path.join(__dirname, '../renderer/index.html'), {
      hash: url ? url : '/'
    })
  }
  // 父窗口关闭时子窗口关闭
  father.on('closed', () => {
    // 子窗口是否存在
    if (childWindow.isDestroyed()) {
      childWindow.destroy()
    }
  })
  childWindow.on('closed', () => {
    childWindow.destroy()
  })

  return childWindow
}

/** 文件流下载 */
export function downloadFile(
  url: string,
  headers: Record<string, string>,
  filePath: string,
  callback: (data: {
    dx: number
    total: number
    status: 'progress' | 'end'
    progress: number
    error?: Error
  }) => void
) {
  const controller = new AbortController()
  const { signal } = controller
  const request = http
    .get(url, { signal, headers }, (res) => {
      const size = parseInt(String(res.headers['content-length']), 10)
      let downloaded = 0
      if (size) {
        // 将文件大小信息写入 .downloading 文件
        fs.appendFileSync(filePath + '.downloading', size.toString())
      }
      // 创建一个可写流来保存文件内容
      const file = fs.createWriteStream(filePath)

      // 监听数据事件来更新下载进度
      res.on('data', (chunk) => {
        downloaded += chunk.length
        const progress = (downloaded / size) * 100
        callback({
          dx: downloaded,
          total: size,
          status: 'progress',
          progress: progress
        })
      })
      res.pipe(file)
      // 监听下载完成事件
      file.on('finish', () => {
        callback({
          dx: downloaded,
          total: size,
          status: 'end',
          progress: 100
        })
        // 删除 .downloading 文件
        fs.unlinkSync(filePath + '.downloading')
      })
    })
    .on('error', (err) => {
      callback({
        dx: 0,
        total: 0,
        status: 'end',
        progress: 0,
        error: err
      })
    })

  return { request, controller }
}

/** 解压 zip 文件
 * @param filePath zip 文件路径
 * @param outputDir 输出目录
 * @param callback 回调函数
 * @returns
 */
export function extractZipFile(
  filePath: string,
  outputDir: string,
  callback?: (data: {
    /** 已提取数量 */
    ex: number
    /** 总数量 */
    total: number
    /** 状态 */
    status: 'progress' | 'end'
    /** 进度 */
    progress: number
    /** 错误 */
    error?: Error
  }) => void
) {
  const AdmZip = require('adm-zip')
  const zip = new AdmZip(filePath)
  const entries = zip.getEntries()
  const totalEntries = entries.length
  let extractedEntries = 0

  for (const entry of entries) {
    const entryPath = path.posix.join(outputDir, entry.entryName)
    zip.extractEntryTo(entry.entryName, outputDir, true, true)
    if (fs.existsSync(entryPath)) {
      extractedEntries++
      callback &&
        callback({
          ex: extractedEntries,
          total: totalEntries,
          status: 'progress',
          progress: (extractedEntries / totalEntries) * 100
        })
    } else {
      callback &&
        callback({
          ex: extractedEntries,
          total: totalEntries,
          status: 'end',
          progress: (extractedEntries / totalEntries) * 100,
          error: new Error('提取失败')
        })
    }
  }

  // 提取完成后调用回调
  callback &&
    callback({
      ex: totalEntries,
      total: totalEntries,
      status: 'end',
      progress: 100
    })
}

/** 获取一个新的msgId */
export function getMsgId() {
  const uuid = randomUUID().toString().replace(/-/g, '')
  return uuid
}

/** 百分比替换
 * @param n 替换数量
 * @param t 总数
 * @param r 替换比例
 * @description
 * n > t || r = 0，抛出异常
 *
 * formula: (((n / t) * 100) / 100) * r
 *
 */
export function replacePercent(n: number, t: number, r: number): number | never {
  if (n === 0) return 0
  // 异常
  if (n > t) throw new Error('替换数量不能大于总数')
  if (r === 0) throw new Error('替换比例不能为0')
  return (((n / t) * 100) / 100) * r
}
