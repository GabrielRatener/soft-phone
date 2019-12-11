
import * as React from "react"
import InputMask from "react-input-mask"
import {
    AppBar,
    Tabs,
    Tab,
    Paper,
    Icon,
    TextField,
    Typography,
    InputAdornment,
    IconButton,
    Fab,
    Input
} from "@material-ui/core"

import Dial from "./dial"


export const tabs = {
    CALL: 0,
    SMS: 1
}

export default class App extends React.Component {
    constructor(props = {}) {
        super(props);

        this.state = {
            tabIndex: tabs.CALL,

            clientID: 'some-fake-id',
            phone: '',

            // this is null when no call is active
            activeCall: null
        }
    }

    clearNumber() {
        this.setState({
            phone: ''
        });
    }

    setTab(tab) {
        this.setState({
            tabIndex: tab
        });
    }

    applyDial(symbol) {
        if (/\d/.test(symbol)) {
            this.setState({
                phone: `${this.state.phone}${symbol}`
            });    
        }
    }

    render() {
        const callIcon = <Icon>phone</Icon>;
        const smsIcon = <Icon>sms</Icon>;
        const adornment = (
            <InputAdornment style={{marginRight: '10px'}}>
                <Fab color="primary" size="small" onClick={() => this.clearNumber()}>
                    <Icon>backspace</Icon>
                </Fab>
            </InputAdornment>
        );
        
        return (
            <Paper square elevation={0}>
                <AppBar position="static">
                    <Tabs value={this.state.tabIndex} variant="fullWidth">
                        <Tab
                            wrapped={+true}
                            label="Phone"
                            icon={callIcon}
                            onClick={() => this.setTab(tabs.CALL)}
                            />
                        <Tab
                            wrapped={+true}
                            label="Send SMS"
                            icon={smsIcon}
                            onClick={() => this.setTab(tabs.SMS)}
                            />
                    </Tabs>
                </AppBar>

                <InputMask
                    mask="(999) 999 - 9999"
                    maskChar=" "
                    value={this.state.phone}
                    style={{maxWidth: '100%'}}
                    >
                    {() => (
                        <TextField
                            fullWidth
                            
                            InputProps={{endAdornment: adornment, style: {paddingRight: '0px'}}}
                            variant="outlined"
                            label="Phone number"
                            margin="normal"
                            type="text"
                            />                            
                    )}
                </InputMask>
                
                <Typography variant="subtitle1" align="left" style={{}}>
                    Your caller ID: {this.state.clientID}
                </Typography>

                {
                    this.state.activeCall !== null ?
                    (
                        <Typography align="right">
                            {this.state.activeCall.duration}
                        </Typography>
                    ) :
                    null
                }

                <Dial onDial={(symbol) => this.applyDial(symbol)}/>
            </Paper>
        );    
    }
}
