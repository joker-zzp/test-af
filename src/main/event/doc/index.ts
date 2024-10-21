import { docCreateDir, docCreateFile, docDeleteDir, docDeleteFile, docSearch } from './base'
import { resultMsg } from './msg'

export const doc = {
  base: {
    /** 搜索文件文件夹 */
    search: (params: Parameters<typeof docSearch>[0]) => {
      return new Promise((resolve, reject) => {
        try {
          const res = docSearch(params)
          const result = resultMsg().set('success.query')
          result.data = res
          resolve(result)
        } catch (error) {
          reject(resultMsg().setError('fail.query', error as Error))
        }
      })
    },

    /** 删除文件 || 文件夹 */
    delete: (type: 'file' | 'dir', name: string) => {
      return new Promise((resolve, reject) => {
        try {
          if (type === 'file') {
            docDeleteFile(name)
          }
          if (type === 'dir') {
            docDeleteDir(name)
          }
          resolve(true)
        } catch (error) {
          if (type === 'file') {
            reject(resultMsg().setError('fail.delete.file', error as Error))
          }
          if (type === 'dir') {
            reject(resultMsg().setError('fail.delete.folder', error as Error))
            return
          }
          reject(resultMsg().setError('error.unknown', error as Error))
        }
      })
    },

    /** 创建文件 || 文件夹 */
    create: (type: 'file' | 'dir', name: string) => {
      return new Promise((resolve, reject) => {
        try {
          if (type === 'file') {
            docCreateFile(name)
          }
          if (type === 'dir') {
            docCreateDir(name)
          }
          resolve(true)
        } catch (error) {
          if (type === 'file') {
            reject(resultMsg().setError('fail.create.file', error as Error))
          }
          if (type === 'dir') {
            reject(resultMsg().setError('fail.create.folder', error as Error))
            return
          }
          reject(resultMsg().setError('error.unknown', error as Error))
        }
      })
    }
  }
}
