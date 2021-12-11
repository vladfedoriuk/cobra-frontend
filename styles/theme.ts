import { createTheme } from '@mui/material/styles'

let theme = createTheme({
  palette: {
    primary: {
      main: '#5BC0EB',
    },
    secondary: {
      main: '#FDE74C',
    },
    error: {
      main: '#C3423F',
    },
    info: {
      main: '#404E4D',
    },
    success: {
      main: '#9BC53D',
    },
  },
})

theme = createTheme(theme, {
  palette: {
    warning: {
      main: theme.palette.secondary.main,
    },
  },
})

export default theme
