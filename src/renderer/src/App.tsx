import { Box, CssBaseline, Stack, ThemeProvider, Typography } from '@mui/material'
import { useEffect, useReducer } from 'react'
import { defaultTheme } from './theme'

import BasicRoute from './router'
import { useLocation, useNavigate } from 'react-router-dom'
import { AppReducer, AppContex, initAppStatus } from './utils/app'

function App(): JSX.Element {
  const appinfo = window.clientEvent.invoke('app::info')
  const systemUserInfo = window.clientEvent.invoke('app::systemInfo')
  const [appState, appDispatch] = useReducer(AppReducer, initAppStatus)

  const goto = useNavigate()
  const { pathname } = useLocation()

  useEffect(() => {
    appinfo
      .then((res) => {
        appDispatch({
          event: 'set::appInfo',
          payload: {
            name: res.name,
            version: res.version
          }
        })
      })
      .finally(() => {
        systemUserInfo.then((res) => {
          appDispatch({
            event: 'set::systemInfo',
            payload: {
              platform: res.platform,
              arch: res.arch,
              version: res.version
            }
          })
        })
      })
    // 跳转页面
    if (pathname === '/') {
      appDispatch({ event: 'set::url', payload: '/home' })
    }
  }, [])

  useEffect(() => {
    console.log(1)
    if (appState.cacheData.url && appState.cacheData.url !== pathname) {
      goto(appState.cacheData.url)
    }
  }, [appState.cacheData.url])

  return (
    <AppContex.Provider value={{ state: appState, dispatch: appDispatch }}>
      <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        <Box id="appRoot" width={1} height={1} p={0.3} paddingTop={0}>
          <Stack direction={'row'} alignItems={'stretch'} height={1} borderBottom={1}>
            {appState.cacheData.showSidebar && (
              <Stack direction={'column'} width={50} height={1} borderRight={1}>
                <Box>home</Box>
              </Stack>
            )}
            <Box flexGrow={1} data-url={appState.cacheData.url} p={0.5}>
              <BasicRoute />
            </Box>
          </Stack>
        </Box>
      </ThemeProvider>
    </AppContex.Provider>
  )
}

export default App
