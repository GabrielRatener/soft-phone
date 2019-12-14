
import {Grid, Typography} from "@material-ui/core"

export default function StatusBar(props) {
    return (
        <Grid container justify="space-between">
            <Grid item>
                <Typography variant={props.variant} align="left">
                    {props.leftText}
                </Typography>
            </Grid>

            <Grid item>
                <Typography variant={props.variant} align="right">
                    {props.rightText}
                </Typography>
            </Grid>
        </Grid>
    );
}