import { ResultMessage } from '../../util/message'

export const messageTemplate = {
  // 查询
  'success.query': '查询成功',
  'fail.query': '查询失败',

  // 操作成功
  'success.create.file': '文件创建成功',
  'success.delete.file': '文件删除成功',
  'success.rename.file': '文件重命名成功',
  'success.move.file': '文件移动成功',
  'success.copy.file': '文件复制成功',
  'success.create.folder': '文件夹创建成功',
  'success.delete.folder': '文件夹删除成功',
  'success.rename.folder': '文件夹重命名成功',
  'success.move.folder': '文件夹移动成功',
  'success.copy.folder': '文件夹复制成功',

  // 操作失败
  'fail.create.file': '文件创建失败',
  'fail.delete.file': '文件删除失败',
  'fail.rename.file': '文件重命名失败',
  'fail.move.file': '文件移动失败',
  'fail.copy.file': '文件复制失败',
  'fail.create.folder': '文件夹创建失败',
  'fail.delete.folder': '文件夹删除失败',
  'fail.rename.folder': '文件夹重命名失败',
  'fail.create.file.exist': '文件已存在',
  'fail.create.folder.exist': '文件夹已存在',
  'fail.create.file.notexist': '文件不存在',
  'fail.create.folder.notexist': '文件夹不存在',
  'fail.create.file.permission': '文件权限不足',
  'fail.create.folder.permission': '文件夹权限不足',

  // 异常
  'error.unknown': '未知错误'
}

export const resultMsg = () => new ResultMessage(messageTemplate)
