import { Theme } from '@mui/material'
import { createReducerContext } from '../base/status'
import { FormatStr } from '../base/data'
import { MainEvent } from '../base/event'

/** 应用状态 */
type AppStatus = {
  theme?: Theme
  // 系统信息
  appInfo: {
    name: string | null
    version: string | null
  }
  systemInfo: {
    platform: string | null
    arch: string | null
    version: string | null
  }
  // 缓存数据
  cacheData: {
    // 当前页面url
    url: string | null
    // 是否显示侧边栏
    showSidebar?: boolean
    // 是否显示顶部栏
    showTopBar?: boolean
    // 视图状态
    viewState: {
      home: unknown | null
      document: unknown | null
      setting: unknown | null
      extension: unknown | null
    }
  }
}

export const initAppStatus: AppStatus = {
  theme: undefined,
  appInfo: {
    name: null,
    version: null
  },
  systemInfo: {
    platform: null,
    arch: null,
    version: null
  },
  cacheData: {
    showSidebar: false,
    showTopBar: true,
    url: null,
    viewState: {
      home: null,
      document: null,
      setting: null,
      extension: null
    }
  }
}

export const [AppReducer, AppContex] = createReducerContext(
  {
    /** 设置 应用 module title */
    'set::title': (_state, payload: string[]) => {
      MainEvent.send('app::base::setWinTitle', payload)
    },
    /** 设置应用信息 */
    'set::appInfo': (state, payload: AppStatus['appInfo']) => {
      state.appInfo = payload
      return state
    },
    /** 设置系统信息 */
    'set::systemInfo': (state, payload: AppStatus['systemInfo']) => {
      state.systemInfo = payload
      return state
    },
    /** 设置url */
    'set::url': (state, payload: string | null) => {
      if (state.cacheData.url != payload) {
        state.cacheData.url = payload
        return state
      }
      return
    },
    /** 设置侧边栏 */
    'set::showSidebar': (state, payload: boolean) => {
      if (state.cacheData.showSidebar != payload) {
        state.cacheData.showSidebar = payload
        return state
      }
      return
    },
    /** 设置顶部栏 */
    'set::showTopBar': (state, payload: boolean) => {
      if (state.cacheData.showTopBar != payload) {
        state.cacheData.showTopBar = payload
        return state
      }
      return
    }
  },
  initAppStatus,
  FormatStr.mark('AppStatus')
)
