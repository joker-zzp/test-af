/** 检查版本是否需要升级
 * @param oldV 旧版本
 * @param newV 新版本
 * @returns boolean 旧版本 < 新版本返回 true | 旧版本 >= 新版本返回 false
 * @example
 * ```
 * checkVersionUpgrade('1.0.0', '1.0.1') // true
 * checkVersionUpgrade('1.0.1', '1.0.0') // false
 * checkVersionUpgrade('v1.0.0', 'v1.1.0') // true
 * ```
 */
export function checkVersionUpgrade(oldv: string, newV: string): boolean {
  // 将版本号字符串转换为数组，以便逐个比较
  const oldVersion = oldv.toLocaleLowerCase().startsWith('v')
    ? oldv.substring(1).split('.').map(Number)
    : oldv.split('.').map(Number)
  const newVersion = newV.toLocaleLowerCase().startsWith('v')
    ? newV.substring(1).split('.').map(Number)
    : newV.split('.').map(Number)

  // 获取两个版本号的长度，取较长的那个长度进行比较
  const maxLength = Math.max(oldVersion.length, newVersion.length)

  for (let i = 0; i < maxLength; i++) {
    const num1 = oldVersion[i] || 0
    const num2 = newVersion[i] || 0

    if (num1 < num2) {
      return true // 旧版本 < 新版本
    } else if (num1 > num2) {
      return false // 旧版本 > 新版本
    }
  }

  // 如果所有版本号都相等，则旧版本 >= 新版本
  return false
}

/** 时间戳转字符串
 * @param timestamp 时间戳
 * @param format 格式化字符串
 * @returns string
 * @example
 * ```
 * timestampToString(1633072800000, 'YYYY-MM-DD HH:mm:ss') // 2021-10-01 00:00:00
 * timestampToString(1633072800000, 'YYYY/MM/DD HH:mm:ss') // 2021/10/01 00:00:00
 * timestampToString(1633072800000, 'YYYY-MM-DD') // 2021-10-01
 * timestampToString(1633072800000, 'YYYY/MM/DD') // 2021/10/01
 * timestampToString(1633072800000, 'HH:mm:ss') // 00:00:00
 * timestampToString(1633072800000, 'MM-DD') // 10-01
 * timestampToString(1633072800000, 'MM/DD') // 10/01
 * timestampToString(1633072800000, 'YYYY-MM-DD HH:mm:ss.SSS') // 2021-10-01 00:00:00.000
 * ```
 */
export function timestampToString(timestamp: number, format: string): string {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()
  // 毫秒
  const milliseconds = date.getMilliseconds()

  // 格式化月份、日期、小时、分钟、秒数为两位数
  const monthStr = month < 10 ? '0' + month : month.toString()
  const dayStr = day < 10 ? '0' + day : day.toString()
  const hoursStr = hours < 10 ? '0' + hours : hours.toString()
  const minutesStr = minutes < 10 ? '0' + minutes : minutes.toString()
  const secondsStr = seconds < 10 ? '0' + seconds : seconds.toString()
  // 替换格式化字符串中的占位符
  format = format.replace('YYYY', year.toString())
  format = format.replace('MM', monthStr)
  format = format.replace('DD', dayStr)
  format = format.replace('HH', hoursStr)
  format = format.replace('mm', minutesStr)
  format = format.replace('ss', secondsStr)
  format = format.replace('SSS', milliseconds.toString())

  return format
}

/** base64编码
 * @param text 需要转换的文本
 * @returns base64编码后的文本
 */
export function encode64(text: string): string {
  const encoder = new TextEncoder()
  const utf8Array = encoder.encode(text)
  const base64String = btoa(String.fromCharCode.apply(null, Array.from(utf8Array)))
  return base64String
}

/** base64解码
 * @param text 需要转换的文本
 * @returns base64解码后的文本
 */
export function decode64(text: string): string | undefined {
  if (!text) return void 0
  const binaryString = atob(text)
  const len = binaryString.length
  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  const decoder = new TextDecoder('utf-8')
  return decoder.decode(bytes)
}

/** 格式化字符串 */
export class FormatStr {
  /** 标记
   * @example
   * ```ts
   * FormatStr.mark('a', 'b', 'c') // [a::b::c]
   * FormatStr.mark('a', 'b', 'c', 'd') // [a::b::c::d]
   * ```
   */
  static mark(...s: string[]) {
    return `[${s.join('::')}]`
  }
}
