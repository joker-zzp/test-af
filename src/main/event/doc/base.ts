import { appData } from '../../env'
import { getConfig } from '../../util/conf'

export const docRootDir = () => {
  const conf = getConfig('settings')
  console.log(conf)
  console.log(appData)
}

export const setWorkspace = () => {
  // TODO
}

/** 创建文件夹 */
export const docCreateDir = (name: string) => {
  // TODO
}

/** 删除文件夹 */
export const docDeleteDir = (path: string) => {
  // TODO
}

/** 重命名文件夹 */
export const docRenameDir = () => {
  // TODO
}

/** 移动文件夹 */
export const docMoveDir = () => {
  // TODO
}

/** 复制文件夹 */
export const docCopyDir = () => {
  // TODO
}

/** 搜索文件夹或文件 */
export const docSearch = (params: {
  keyword: string
  type?: 'file' | 'dir'
  date?: string
}) => {
  // TODO
  // 查询 工作区域内文件夹或文件
  // 返回 文件夹或文件列表
}

/** 创建文件 */
export const docCreateFile = (name: string) => {
  // TODO
}

/** 删除文件 */
export const docDeleteFile = (path: string) => {
  // TODO
}

/** 重命名文件 */
export const docRenameFile = () => {
  // TODO
}

/** 移动文件 */
export const docMoveFile = () => {
  // TODO
}

/** 复制文件 */
export const docCopyFile = () => {
  // TODO
}
