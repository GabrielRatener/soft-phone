
import {
    TextField,
    InputAdornment,
    Fab
} from "@material-ui/core"

import InputMask from "react-input-mask"

export default function NumberField({icon, value, disabled, onButtonClick = () => {}}) {

    const adornment = (
        <InputAdornment style={{marginRight: '10px'}}>
            <Fab
                color="primary"
                size="small"
                disabled={disabled}
                onClick={() => onButtonClick.apply(this, [])}
            >
                {icon}
            </Fab>
        </InputAdornment>
    );

    return (
        <InputMask
            mask="999-999-9999"
            maskChar=" "
            value={value}
            >
            {() => (
                <TextField
                    fullWidth
                    
                    InputProps={{endAdornment: adornment, style: {paddingRight: 0}}}
                    variant="outlined"
                    label="Phone number"
                    margin="normal"
                    size="large"
                    type="text"
                    />                            
            )}
        </InputMask>
    )
}