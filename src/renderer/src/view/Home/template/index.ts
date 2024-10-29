import { KanbanBoxTemplate } from '@renderer/components'

type ToolT = {
  title: string
  // 多语言key
  languageKey: string
  content: KanbanBoxTemplate[]
}

const ToolsTemplate: ToolT = {
  title: '工具箱',
  languageKey: 'tools',
  content: []
}

const homeInfo: {
  [k in 'appInfo' | 'system' | 'network']: {
    label: string
    content: { [k: string]: KanbanBoxTemplate }
  }
} = {
  appInfo: {
    label: '应用信息',
    content: {
      // 'app::name': {
      //   key: 'name',
      //   label: '应用名称',
      //   showLabel: false
      // },

      'app::version': {
        key: 'version',
        label: '应用版本',
        showLabel: true
      }
    }
  },
  system: {
    label: '系统信息',
    content: {
      'sys::platform': {
        key: 'platform',
        label: '操作系统',
        showLabel: true
      },
      'sys::arch': {
        key: 'arch',
        label: '系统架构',
        showLabel: true
      },
      'sys::version': {
        key: 'version',
        label: '系统版本',
        showLabel: true
      }
    }
  },
  network: {
    label: '网络信息',
    content: {}
  }
}

export const HomeTemplate = {
  title: '工作面板',
  languageKey: 'home',
  module: 'home',
  info: homeInfo,
  tools: ToolsTemplate
} as const
