import { systemInfo } from '../env'

const defaultTemplate = {
  success: '成功',
  error: '错误'
} as const

export class ResultMessage<T extends { [key: string]: string }> {
  language: string
  template: T
  code?: keyof T
  message?: string
  error?: string
  data?

  constructor(template: T) {
    if (systemInfo.language === 'en') {
      this.language = 'en'
    } else {
      this.language = 'zh-CN'
    }
    this.template = template || defaultTemplate
  }

  get() {
    if (this.code && this.message) {
      if (this.error) {
        return {
          code: this.code,
          message: this.message,
          error: this.error
        }
      }
      return {
        code: this.code,
        message: this.message,
        data: this.data
      }
    }
    throw new Error('message not set')
  }

  set(key: keyof T, data?) {
    if (this.template[key]) {
      this.code = key
      this.message = this.template[key]
      if (data) {
        this.data = data
      }
      return this
    }
    throw new Error(`message template ${String(key)} not found`)
  }

  setError(key: keyof T, error: Error) {
    if (this.template[key]) {
      this.code = key
      this.message = this.template[key]
      this.data = void 0
      this.error = `[Error:: ${error.name}]${error.message} -> [${error.stack}]`
      return this
    }
    throw new Error(`message template ${String(key)} not found`)
  }
}
