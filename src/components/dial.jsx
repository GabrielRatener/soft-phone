
import {Button, GridList, GridListTile} from "@material-ui/core"

export const DIAL_MODEL = [
    '1', '2', '3',
    '4', '5', '6',
    '7', '8', '9',
    '*', '0', '#',
];

export default function Dial({onDial = (() => null)}) {
    const spacing = 2;

    return (
        <GridList cellHeight={60} cols={3} spacing={spacing}>
            {DIAL_MODEL.map((symbol) => (
                <GridListTile key={symbol}>
                    <Button
                        fullWidth
                        size="large"
                        variant="contained"
                        style={{height: '100%'}}
                        color="secondary"
                        onClick={() => onDial.apply(this, [symbol])}
                    >
                        {symbol}
                    </Button>
                </GridListTile>
            ))}
        </GridList>
    );
}
