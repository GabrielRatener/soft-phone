
import {Grid, Typography} from "@material-ui/core"

export default function StatusBar({leftText, rightText, variant, ...props}) {

    return (
        <Grid container justify="space-between" {...props}>
            <Grid item>
                <Typography variant={variant} align="left">
                    {leftText}
                </Typography>
            </Grid>

            <Grid item>
                <Typography variant={variant} align="right">
                    {rightText}
                </Typography>
            </Grid>
        </Grid>
    );
}
