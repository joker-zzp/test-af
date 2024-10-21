import { Box, CssBaseline, Stack, ThemeProvider, Typography } from '@mui/material'
import { useEffect } from 'react'
import { defaultTheme } from './theme'

function App(): JSX.Element {
  const appinfo = () => window.clientEvent.invoke('app::info')
  const systemUserInfo = () => window.clientEvent.invoke('app::setting::list')

  useEffect(() => {
    appinfo().then((res) => console.log(res))
    systemUserInfo().then((res) => console.log(res))
  })

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Box height={1} width={1} p={0.5}>
        <Stack direction={'row'} width={1} height={1}>
          {/* icon - 菜单 */}
          <Box>
            <Stack>
              <Typography>test</Typography>
            </Stack>
          </Box>
          <Box flexGrow={1}>
            <Stack direction={'column'} height={1} border={1}>
              <Typography>test</Typography>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </ThemeProvider>
  )
}

export default App
