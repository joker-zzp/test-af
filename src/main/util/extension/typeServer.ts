import path from 'path/posix'
import { EXTENSION_TYPE, logmark } from './base'
import { eData } from './data'
import { publicData } from '../publicData'
import { spawnCmdSync, NotificationData } from '../base'
import { logger } from '../log'
import * as net from 'net'
import { baseConf } from '../conf'
import { filename as authFileName } from '../auth'

function serverCheck(name: string) {
  // 在扩展列表中查找名称
  const findIndex = eData.findIndex((item) => item.name === name)
  if (findIndex === -1) {
    throw new Error(`扩展 ${name} 未找到`)
  }
  if (eData[findIndex].type !== EXTENSION_TYPE.service.name) {
    throw new Error('扩展类型错误')
  }
  return findIndex
}

const clientParamsKey = {
  workdir: () => publicData.app.userPath,
  plugin: () => path.posix.join(baseConf.extensionDir, EXTENSION_TYPE.plugin.dir),
  logdir: () => baseConf.logDir,
  resource: () => path.posix.join(baseConf.resourceDir)
}

type Result = {
  code: number
  msg: string
  data
}

export async function serverStart(name: string): Promise<Result> {
  return new Promise((resolve, reject) => {
    // 在扩展列表中查找名称
    try {
      const findIndex = serverCheck(name)
      // 检查当前状态
      if (eData[findIndex].state === 'running') {
        reject(new Error('扩展运行中'))
        return
      }
      if (!eData[findIndex].path) throw new Error('扩展路径未设置')
      if (!publicData.app.userPath) throw new Error('用户路径未设置')
      const cmd = path.posix.relative(publicData.app.userPath, eData[findIndex].path)
      const args = ['start']
      // 客户端自带的启动参数
      for (const key in clientParamsKey) {
        args.push(`--${key}=${clientParamsKey[key]()}`)
      }
      // 后台服务配置
      publicData.conf.httpServer?.url &&
        args.push(`--service-host=${publicData.conf.httpServer?.url}`)
      args.push(`--auth-file=${path.posix.join(publicData.app.userPath, authFileName)}`)
      // 扩展设置
      if (eData[findIndex].settings) {
        const settings = eData[findIndex].settings
        for (const key in settings) {
          args.push(`--${key}=${settings[key]}`)
        }
      }
      logger.info(
        logmark('extension', 'serverStart'),
        '服务启动命令参数:',
        cmd,
        args,
        publicData.app.userPath
      )
      // 命令执行
      spawnCmdSync(cmd, args, {
        cwd: publicData.app.userPath as string
      })
        .then((res) => {
          logger.info(logmark('extension', 'serverStart'), name, res)
          eData[findIndex].state = 'running'
          resolve({
            code: 0,
            msg: '成功',
            data: res
          } as Result)
        })
        .catch((err) => {
          logger.error(logmark('extension', 'serverStart'), name, err)
          reject(err)
        })
    } catch (error) {
      reject(error)
      return
    }
  })
}

export async function serverStop(name: string): Promise<Result> {
  return new Promise((resolve, reject) => {
    try {
      // 在扩展列表中查找名称
      const findIndex = serverCheck(name)
      if (eData[findIndex].state === 'stopped') {
        throw new Error('扩展未运行')
      }
      if (!eData[findIndex].path) throw new Error('扩展路径未设置')
      if (!publicData.app.userPath) throw new Error('用户路径未设置')
      // 命令路径拼接
      const cmd = path.posix.relative(publicData.app.userPath, eData[findIndex].path)
      logger.info(logmark('extension', 'serverStop'), '扩展数据', cmd)
      // 命令执行
      spawnCmdSync(cmd, ['stop'], {
        cwd: publicData.app.userPath as string
      })
        .then((res) => {
          logger.info(logmark('extension', 'serverStop'), name, res)
          eData[findIndex].state = 'stopped'
          resolve({
            code: 0,
            msg: '成功',
            data: res
          } as Result)
        })
        .catch((err) => {
          logger.error(logmark('extension', 'serverStop'), name, err)
          reject(err)
        })
    } catch (err) {
      reject(err)
      return
    }
  })
}

export async function serverState(name: string): Promise<Result> {
  return new Promise((resolve, reject) => {
    try {
      const findIndex = serverCheck(name)
      if (!eData[findIndex].path) throw new Error('扩展路径未设置')
      if (!publicData.app.userPath) throw new Error('用户路径未设置')
      // 命令路径拼接
      const cmd = path.posix.relative(publicData.app.userPath, eData[findIndex].path)
      const args = ['state']
      if (eData[findIndex].settings) {
        const settings = eData[findIndex].settings
        for (const key in settings) {
          args.push(`--${key}=${settings[key]}`)
        }
      }
      // 命令执行
      spawnCmdSync(cmd, args, {
        cwd: publicData.app.userPath as string
      }).then((res) => {
        logger.info(logmark('serverState'), 'spawnCmdSync', 'res', res)
        if (res.includes('running')) {
          eData[findIndex].state = 'running'
        } else {
          eData[findIndex].state = 'stopped'
        }
        resolve({
          code: 0,
          msg: '成功',
          data: eData[findIndex]
        } as Result)
      })
    } catch (err) {
      reject(err)
      return
    }
  })
}

// 加密数据
const encodeData = (data) => Buffer.from(JSON.stringify(data), 'utf-8').toString('base64')
// 解码
const decodeData = (data) => JSON.parse(Buffer.from(data, 'base64').toString('utf-8'))
// 结果成功判断
const resultSuccess = (data) =>
  ((data.result == 0 || data.result == 'seccess' || data.code == 0 || data.code == 'seccess') &&
    true) ||
  false

export async function serverSendMsg(info, msg, replay?: (data: Partial<NotificationData>) => void) {
  logger.info(logmark('sendMsg'), '发送消息', info, msg)
  return new Promise((resolve, reject) => {
    try {
      const findIndex = serverCheck(info.name)
      if (eData[findIndex].state !== 'running') {
        throw new Error('扩展未运行')
      }
      // 获取其配置
      const config = eData[findIndex].settings
      if (!config) throw new Error('扩展配置未设置')
      if (typeof config?.port !== 'number') throw new Error('扩展端口未设置')
      // 获取其端口号
      const socket = new net.Socket()
      socket.connect(config.port, '127.0.0.1', () => {
        socket.write(encodeData(msg))
        resolve('消息发送成功')
        replay?.({
          from: 'extension-server',
          id: msg.msgId,
          type: 'success',
          message: '消息发送成功'
        })
      })
      // 检查连接状态
      socket.on('connect', () => {
        logger.info(logmark('sendMsg'), info, '连接成功')
      })
      socket.on('error', (err) => {
        logger.error(logmark('sendMsg'), info, '消息发送失败\n', err)
        replay?.({
          from: `${eData[findIndex].name}-${EXTENSION_TYPE.service.name}`,
          type: 'error',
          message: '连接失败',
          data: err.message
        })
        socket.destroy()
        socket.end()
      })
      socket.on('close', () => {
        logger.info(logmark('sendMsg'), info, '断开连接')
        replay?.({
          from: `${eData[findIndex].name}-${EXTENSION_TYPE.service.name}`,
          type: 'info',
          message: '连接断开'
        })
        socket.destroy()
        socket.end()
      })
      socket.on('data', (res) => {
        try {
          logger.info(logmark('sendMsg'), info, '收到消息\n', res.toString('utf-8'))
          const resData = decodeData(res.toString('utf-8'))
          if (resData?.msg) {
            replay?.({
              from: `${eData[findIndex].name}-${EXTENSION_TYPE.service.name}`,
              type: resultSuccess(resData) ? 'success' : 'error',
              message: resData.msg
            })
          } else {
            replay?.({
              from: `${eData[findIndex].name}-${EXTENSION_TYPE.service.name}`,
              type: 'success',
              message: '收到消息',
              data: resData
            })
          }
        } catch (err) {
          logger.error(logmark('sendMsg'), info, '消息解析失败\n', err)
          replay?.({
            from: `${eData[findIndex].name}-${EXTENSION_TYPE.service.name}`,
            type: 'error',
            message: '消息解析失败'
          })
          reject(err)
          return
        }
        // 获取其窗口 回复消息
      })
    } catch (err) {
      logger.error(logmark('sendMsg'), info, '消息发送失败\n', err)
      replay?.({
        from: `${EXTENSION_TYPE.service.name}`,
        type: 'error',
        message: (err as Error).message || '消息发送失败'
      })
      reject(err)
      return
    }
  })
}
