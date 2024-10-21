import { createTheme } from '@mui/material/styles'
import { baseOptions } from './base'

export const redTheme = createTheme({
  ...baseOptions,
  palette: {
    mode: 'dark',
    common: {
      black: '#000',
      white: '#fff'
    },
    primary: {
      main: '#8759f2',
      contrastText: '#fff'
    },
    secondary: {
      main: '#31d055'
    },
    success: {
      main: '#00d816'
    },
    warning: {
      main: '#f57c00'
    },
    error: {
      main: '#d20202'
    },
    background: {
      paper: '#33314b',
      default: '#2b293d'
    },
    text: {
      primary: '#fff'
    }
  }
})
