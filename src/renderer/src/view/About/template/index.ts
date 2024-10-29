import { KanbanBoxTemplate } from '@renderer/components'

type AboutT = {
  title: string
  // 多语言key
  languageKey: string
  content: KanbanBoxTemplate[]
}

export const AboutTemplate: AboutT = {
  title: '关于',
  languageKey: 'about',
  content: [
    {
      key: 'name',
      valueVariant: 'h1',
      textAlign: 'center'
    },
    {
      key: 'version',
      valueVariant: 'h3',
      textAlign: 'center'
    }
  ]
}
