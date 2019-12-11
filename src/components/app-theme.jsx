import {
    MuiThemeProvider,
    createMuiTheme,
    colors
} from "@material-ui/core"

export const theme = createMuiTheme({
    palette: {
        primary: {
            main: colors.blue[500],
            contrastText: '#fff'
        },
        secondary: {
            main: '#fff',
            contrastText: colors.blue[500]
        }
    }
});

export default function AppTheme(props) {
    return (
        <MuiThemeProvider theme={theme}>
            {props.children}
        </MuiThemeProvider>
    )
}
