
import * as React from "react"
import {
    AppBar,
    Tabs,
    Tab,
    Paper,
    Icon,
    Typography,
    FormGroup,
    Button
} from "@material-ui/core"

import device from "../device"
import AppTheme from "./app-theme"
import NumberField from "./number-field"
import Dial from "./dial"

export const tabs = {
    CALL: 0,
    SMS: 1
}

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tabIndex: tabs.CALL,

            clientID: 'some-fake-id',
            phone: '',

            callStatus: null,

            // this is null when no call is active
            call: null
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

    startCall() {
        const call = device.connect({
            'to': this.state.phone
        });

        // TODO: Listen to call events
    }

    hangUpCall() {
        // TODO: >this<
    }

    muteCall() {
        // TODO: >this<
    }

    render() {
        
        const CallControls = (props) =>
            (this.state.call !== null) ?
                (
                    <FormGroup {...props}>
                        <Button
                            fullWidth
                            size="large"
                            variant="contained"
                            onClick={() => this.hangUpCall()}
                        >
                            Hang Up
                        </Button>

                        <Button
                            fullWidth
                            size="large"
                            variant="contained"
                            onClick={() => this.muteCall()}
                        >
                            Mute
                        </Button>
                    </FormGroup>
                ) : (
                    <FormGroup {...props}>
                        <Button
                            fullWidth
                            size="large"
                            variant="contained"
                            color="primary"
                            onClick={() => this.startCall()}
                        >
                            Call
                        </Button>
                    </FormGroup>
                );
        

        return (
            <AppTheme>
                <Paper square elevation={4} style={{padding: 0, maxWidth: 400}}>
                    <AppBar position="static" color="secondary">
                        <Tabs
                            value={this.state.tabIndex}
                            variant="fullWidth"
                            textColor="primary"
                            indicatorColor="primary"
                            >
                            <Tab
                                wrapped={+true}
                                label="Phone"
                                icon={<Icon>phone</Icon>}
                                onClick={() => this.setTab(tabs.CALL)}
                                />
                            <Tab
                                wrapped={+true}
                                label="Send SMS"
                                icon={<Icon>sms</Icon>}
                                onClick={() => this.setTab(tabs.SMS)}
                                />
                        </Tabs>
                    </AppBar>
                    
                    <Paper square elevation={0} style={{padding: 5}}>
                        <NumberField
                            value={this.state.phone}
                            icon={<Icon>backspace</Icon>}
                            onButtonClick={() => this.clearNumber()}
                            />
                        
                        <Typography variant="subtitle1" align="left">
                            Your caller ID: {this.state.clientID}
                        </Typography>

                        {
                            this.state.call !== null ?
                            (
                                <Typography align="right">
                                    {this.state.activeCall.duration}
                                </Typography>
                            ) :
                            null
                        }

                        <Dial onDial={(symbol) => this.applyDial(symbol)}/>

                        <CallControls style={{marginTop: 20}} />
                    </Paper>
                </Paper>
            </AppTheme>
        );    
    }
}
