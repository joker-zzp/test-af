import * as fs from 'fs'

/** 读取json数据 */
export function readJsonData(filePath: string): unknown {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

/** 写入json数据 */
export function writeJsonData(filePath: string, data: object): void {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8')
}
