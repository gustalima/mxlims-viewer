import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#1565c0',
        },
        secondary: {
            main: '#00838f',
        },
    },
    shape: {
        borderRadius: 4,
    },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
        </ThemeProvider>
    </StrictMode>,
)
