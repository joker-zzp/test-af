// import path from 'path/posix'
// import {
//   EXTENSION_TYPE,
//   ExtensionData,
//   ExtensionProgress,
//   InterfaceInfoType,
//   logmark
// } from './base'
// import { confRootDir } from '../conf'
// import { fs, writeJsonData, readJsonData } from '../base'
// import { logger } from '../log'

// export const eData: ExtensionData[] = []
// export const progress: { [k: string]: ExtensionProgress } = {}

// const defaultInfo: ExtensionData = {
//   name: 'default',
//   enable: true,
//   type: 'other',
//   showHome: false
// }

// /**
//  * 初始化扩展信息
//  * @param params 参数数据
//  * @param reset 是否重置配置 default: false 优先本地配置 参数内容合并到本地配置
//  * @returns
//  */
// export function initInfo(
//   params: {
//     [k in keyof ExtensionData]+?: ExtensionData[k]
//   },
//   reset: boolean = false
// ) {
//   if (!params.name) return
//   logger.info(logmark('initInfo'), 'params', params)
//   const newInfo: ExtensionData = { ...defaultInfo, ...params }
//   logger.info(logmark('initInfo'), 'newInfo', newInfo)
//   // setting 特别处理 优先本地配置
//   // TODO: 查找数据中是否存在索引
//   let fIndex = eData.findIndex((item) => item.name === newInfo.name)
//   const configPath = path.posix.join(confRootDir(), `${newInfo.name}.json`)
//   // 没有被记录时
//   if (fIndex === -1) {
//     // 查找其config文件
//     if (!fs.existsSync(configPath)) {
//       // 不存在则创建
//       writeJsonData(configPath, { ...newInfo, state: undefined })
//       eData.push(newInfo)
//       return
//     }
//     // 列表增加逻辑 和 更新逻辑 相同 将其index增加即为更新
//     fIndex = eData.length
//   }

//   // 重置所有属性
//   if (reset) {
//     eData[fIndex] = newInfo
//     // 写入文件
//     writeJsonData(configPath, { ...newInfo, state: undefined })
//     return
//   }
//   // 不重置时 读取文件内容
//   const localInfo = fs.existsSync(configPath) ? readJsonData(configPath) : {}
//   logger.info(logmark('initInfo'), 'localInfo', localInfo)
//   // setting 合并
//   newInfo.settings = { ...eData[fIndex]?.settings, ...newInfo?.settings, ...localInfo?.settings }
//   // 其他属性合并
//   eData[fIndex] = { ...localInfo, ...eData[fIndex], ...newInfo }
//   // 写入文件
//   logger.info(logmark('initInfo'), 'writeJsonData', configPath, eData[fIndex])
//   writeJsonData(configPath, { ...eData[fIndex], state: undefined })
//   return
// }

// export function queryLocalData(params: {
//   id?: number
//   name?: string // 查询的扩展名
//   type?: string | number // 查询的扩展类型
// }) {
//   logger.info(logmark('queryLocalData'), params)
//   if (params.id || params.name || params.type) {
//     const res = eData.filter((item) => {
//       if (params.name) {
//         if (item.name.includes(params.name)) return true
//       }
//       if (params.type) {
//         if (params.type === item.type) return true
//         if (params.type === EXTENSION_TYPE[item.type].key) return true
//       }
//       if (params.id) {
//         if (item?.id === params.id) return true
//       }
//       return false
//     })
//     // 同步文件中配置
//     res.forEach((item) => {
//       const configPath = path.posix.join(confRootDir(), `${item.name}.json`)
//       if (fs.existsSync(configPath)) {
//         const localInfo = readJsonData(configPath)
//         item.baseConfig = { ...item.baseConfig, ...localInfo.baseConfig }
//         item.settings = { ...item.settings, ...localInfo.settings }
//       }
//     })
//     return res
//   }
//   logger.info(logmark('queryLocalData'), 'all')
//   return eData
// }

// export function updateInfo(params: ExtensionData) {
//   logger.info(logmark('extension', 'data', 'updateInfo'), 'params', params)
//   const fIndex = eData.findIndex((item) => item.name === params.name)
//   if (fIndex === -1) return
//   const newData = { ...eData[fIndex], ...params }
//   eData[fIndex] = newData
//   // 检查配置文件是否存在
//   const configPath = path.posix.join(confRootDir(), `${params.name}.json`)
//   if (fs.existsSync(configPath)) {
//     writeJsonData(configPath, { ...newData, state: undefined })
//   }
//   // 扩展类型为插件时 更新setting.json
//   if (eData[fIndex].path && newData.type === 'plugin') {
//     const psfile = path.posix.join(eData[fIndex].path, 'setting.json')
//     if (params.settings) {
//       writeJsonData(psfile, params.settings)
//     } else {
//       throw Error('settings is undefined')
//     }
//   }
//   return eData[fIndex]
// }

// export function updateSetting(params: {
//   id: ExtensionData['id']
//   name: ExtensionData['name']
//   setting: ExtensionData['settings']
// }) {
//   logger.info(logmark('extension', 'data', 'settingUpdate'), 'params', params)
//   const fIndex = eData.findIndex((i) => i.name === params.name)
//   if (fIndex === -1) {
//     throw Error(`Not find ${params.name}`)
//   }
//   const fd = eData[fIndex]
//   fd.settings = { ...fd.settings, ...params.setting }
//   if (fd.type === 'plugin') {
//     // 扩展数据
//     if (fd.path === undefined) {
//       throw Error(`Extension path is undefined`)
//     }
//     const psfile = path.posix.join(fd.path, 'setting.json')
//     writeJsonData(psfile, fd.settings)
//   }
// }

// /** 删除扩展信息
//  * @description
//  * 删除某个扩展信息
//  * @params name 扩展名称
//  */
// export function removeInfo(params: { name: string }) {
//   logger.info(logmark('extension', 'data', 'removeInfo'), 'params', params)
//   const fIndex = eData.findIndex((item) => item.name === params.name)
//   if (fIndex === -1) return
//   eData.splice(fIndex)
// }

// /** 查询进度数据
//  * @description
//  * 查询某个进度数据
//  * @params name 进度名称
//  */
// export function queryProgress(params: { name: string }) {
//   logger.info(logmark('queryProgress'), 'params', params)
//   return progress[params.name]
// }

// /** 删除进度数据
//  * @description
//  * 删除某个进度数据 进度不删除当前扩展无法进行同类型操作
//  * @params name 进度名称
//  */
// export function removeProgress(params: { name: string }) {
//   logger.info(logmark('removeProgress'), 'params', params)
//   delete progress[params.name]
// }

// /** 查询接口数据
//  * @params event 查询的接口事件
//  */
// export function queryInterface(params?: { event?: string }) {
//   logger.info(logmark('queryInterface'), params)
//   const res: InterfaceInfoType[] | InterfaceInfoType = []
//   if (params) {
//     // event = "extension:install"
//     if (!params.event) return undefined
//     const findData = eData.find((item) => item.name === params.event?.split(':')[0])
//     if (!findData) return undefined
//     if (findData?.baseConfig?.provide && findData.baseConfig.provide instanceof Array) {
//       // 查找其中event = "extension:install"
//       const x = findData.baseConfig.provide.find((item) => item.event === params.event)
//       // 查找其扩展对应事件 接口配置
//       if (!x) return undefined
//       res.push({ name: findData.name, ...x })
//     }
//     return res[0]
//   } else {
//     // 查询所有接口
//     eData.forEach((item) => {
//       if (item?.baseConfig?.provide) {
//         const provideArray = item.baseConfig.provide
//         if (Array.isArray(provideArray)) {
//           provideArray.forEach((pItem) => {
//             res.push({
//               name: item.name,
//               ...pItem
//             })
//           })
//         }
//       }
//     })
//   }
//   return res
// }

// /** 查询模块数据
//  * @description
//  * 用于查询某个模块页面的接口扩展功能
//  * 通过扩展的配置进行界面渲染
//  * @params moduleName 模块名称 eg: "case"
//  * @params view 模块视图 eg: "menu"
//  */
// export function queryModuleData(params?: { moduleName?: string; view?: string }) {
//   logger.info(logmark('queryModuleData'), 'params', params)
//   const res: {
//     // 扩展名称
//     name: string
//     key: string | number
//     label?: string
//     icon?: string
//     event?
//   }[] = []
//   eData.forEach((item) => {
//     if (!item?.baseConfig?.viewData) return
//     const viewData = item.baseConfig.viewData
//     if (!(viewData.module && viewData.module instanceof Array)) return
//     viewData.module.forEach((mItem, i) => {
//       if (params) {
//         if (params.moduleName && params.moduleName !== mItem.module) return
//         if (params.view && params.view !== mItem.view) return
//       }
//       res.push({
//         name: item.name,
//         key: mItem?.key || `Tools-${item.name}-${i}`,
//         label: mItem?.label,
//         icon: mItem?.icon,
//         event: mItem?.event
//       })
//     })
//   })
//   return res
// }
