
import {Grid, Typography} from "@material-ui/core"

export default function StatusBar({leftContent, rightContent, variant, ...props}) {

    return (
        <Grid container justify="space-between" {...props}>
            <Grid item>
                <Typography variant={variant} align="left">
                    {leftContent}
                </Typography>
            </Grid>

            <Grid item>
                <Typography variant={variant} align="right">
                    {rightContent}
                </Typography>
            </Grid>
        </Grid>
    );
}
