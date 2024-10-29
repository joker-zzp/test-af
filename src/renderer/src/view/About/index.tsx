import { Box, Stack, Typography } from '@mui/material'
import { AboutTemplate } from './template'
import { useContext } from 'react'
import { AppContex } from '@renderer/utils/app'

export function AboutView() {
  const AT = AboutTemplate
  const appCT = useContext(AppContex)


  return (
    <Box>
      <Stack direction={'column'}>
        <Box>
          <Typography />
        </Box>
      </Stack>
    </Box>
  )
}

export function VersionView() {
  return null
}
