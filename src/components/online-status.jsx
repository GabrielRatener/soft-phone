
import {Icon, Chip, Typography} from "@material-ui/core";

export default function OnlineStatus({variant, value}) {
    const color = value ? 'green' : 'red';
    const style = {color};

    return (
        <Chip
            variant="outlined"
            icon={<Icon style={style}>{value ? 'check_circle' : 'cancel'}</Icon>}
            label={
                <Typography variant={variant} style={style}>
                    {value ? 'Online' : 'Offline'}
                </Typography>
            }
            style={{...style, borderColor: color}}
            />
    )
}
