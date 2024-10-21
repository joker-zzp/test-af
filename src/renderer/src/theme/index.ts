import { createTheme } from '@mui/material/styles'

import { redTheme } from './red'
export { redTheme }

export const defaultTheme = createTheme({
  components: {
    MuiTypography: {
      defaultProps: {
        fontFamily: '"Fira Code", "Courier New", Consolas, monospace'
      }
    },
    MuiMobileStepper: {
      defaultProps: {
        sx: {
          backgroundColor: '#33314b'
        }
      }
    },
    MuiPaper: {
      defaultProps: {
        elevation: 2
      },
      styleOverrides: {
        root: {
          borderRadius: 8,
          borderColor: '#8759f2'
        }
      }
    },
    MuiListItemButton: {
      defaultProps: {
        disableRipple: true,
        sx: {
          marginY: 0.2,
          borderRadius: 2
        }
      }
    },
    MuiLink: {
      defaultProps: {
        underline: 'hover'
      },
      styleOverrides: {
        underlineHover: {
          cursor: 'pointer',
          color: 'primary.main'
        }
      }
    },
    MuiInputBase: {
      defaultProps: {
        size: 'small'
      }
    },
    MuiButtonBase: {
      styleOverrides: {
        root: {
          padding: 0.5
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          padding: 4
        }
      }
    },
    MuiTextField: {
      defaultProps: {
        size: 'small'
      }
    }
  },
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
      default: 'black'
    },
    text: {
      primary: '#fff',
      secondary: '#8759f2'
    },
    contrastThreshold: 5
  },
  shape: {
    borderRadius: 8
  }
})
