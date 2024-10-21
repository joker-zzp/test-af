import { ThemeOptions } from '@mui/material/styles'

export const baseOptions: ThemeOptions = {
  components: {
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
  }
}
