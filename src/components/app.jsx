import {
    MuiThemeProvider,
    createMuiTheme,
    colors
} from "@material-ui/core"

import SoftPhone from "./soft-phone";

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

export default function App(props) {
    return (
        <MuiThemeProvider theme={theme}>
            <SoftPhone {...props} />
        </MuiThemeProvider>
    )
}
