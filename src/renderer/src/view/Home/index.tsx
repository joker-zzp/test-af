import { Box, Divider, Stack, Typography } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { HomeTemplate } from './template'
import { AppContex } from '@renderer/utils/app'
import { KanbanBox } from '@renderer/components'

export function HomeView(): JSX.Element {
  const [tools, setTools] = useState([])
  const appCT = useContext(AppContex)

  const hTD: {
    T: typeof HomeTemplate.info
    D: { [k in keyof typeof HomeTemplate.info]: unknown }
  } = {
    T: HomeTemplate.info,
    D: {
      appInfo: appCT.state.appInfo,
      system: appCT.state.systemInfo,
      network: {}
    }
  }
  const tTD = {}
  const exkd = {}

  useEffect(() => {
    appCT.dispatch({ event: 'set::title', payload: [HomeTemplate.title] })
  }, [])

  return (
    <Stack direction={'column'} alignItems={'stretch'} spacing={1} divider={<Divider />}>
      <Box>
        <Stack direction={'row'} spacing={1}>
          {Object.entries(hTD.T).map(([k, v]) => (
            <Box
              key={k}
              border={1}
              p={0.5}
              width={1 / Object.keys(hTD.T).length}
              borderRadius={1}
              borderColor={'primary.main'}
            >
              <Stack direction={'column'}>
                <Typography variant="h6">{v.label}</Typography>
                <Box flexGrow={1}>
                  <KanbanBox data={hTD.D[k]} template={v.content} />
                </Box>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
      <Box>
        <Typography variant="h5">工具箱</Typography>
      </Box>
    </Stack>
  )
}
