import * as fs from 'fs'
import * as os from 'os'
import path from 'path'

/** 读取json数据 */
export function readJsonData(filePath: string): unknown {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

/** 写入json数据 */
export function writeJsonData(filePath: string, data: object): void {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8')
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

/** 路径格式化 */
export function pathFormat(filePath: string): string {
  return path.posix.normalize(filePath)
}
