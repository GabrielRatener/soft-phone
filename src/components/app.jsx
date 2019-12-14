
import * as React from "react"
import {
    AppBar,
    Tabs,
    Tab,
    Paper,
    Icon,
    Button,
    Grid
} from "@material-ui/core"

import {formatTime} from "../utils"

import device from "../device"
import AppTheme from "./app-theme"
import StatusBar from "./status-bar"
import NumberField from "./number-field"
import Dial from "./dial"

const phonePattern = /^\d{10}$/;

const styles = {
    buttonIcon: {
        paddingRight: 5
    }
}

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
            muted: false,

            // can be 'closed', 'pending' or 'open'
            callStatus: 'closed',

            // this is null when no call is active
            call: null, // {phone: <phone number>, start}

            _interval: null // for updating current time...
        }
    }

    clearNumber() {
        this.setState({
            phone: ''
        });
    }

    eraseLastChar() {
        this.setState({
            phone: this.state.phone.slice(0, -1)
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
        const connection = device.connect({
            'to': this.state.phone
        });

        connection.on('accept', () => {
            this.setState({
                callStatus: 'open',
                call: {
                    ...this.state.call,
                    start: Date.now()
                },

                // to always show the number of seconds elapsed
                _interval: window.setInterval(() => {
                    this.forceUpdate();
                }, 1000)
            });
        });

        connection.on('ringing', () => {
            // TODO: show ringing...
        });

        connection.on('disconnect', () => {
            window.clearTimeout(this.state._interval);

            this.setState({
                callStatus: 'closed',
                call: null,

                _interval: null
            });
        });

        this.setState({
            callStatus: 'pending',
            call: {
                start: null,
                phone: this.state.phone
            }
        });
    }

    hangUpCall() {
        // TODO: >this<
    }

    toggleCallSound() {
        // TODO: Actually mute/unmute call...

        this.setState({
            muted: !this.state.muted
        });
    }

    render() {
        const elapsedTime =
          (this.state.call && this.state.call.start !== null) ?
            Date.now() - this.state.call.start :
            null;

        const CallControls = (props) => {
            if (this.state.callStatus === 'open') {
                return (
                    <Grid container spacing={4} {...props}>
                        <Grid item xs={6}>
                            <Button
                                fullWidth
                                size="large"
                                variant="contained"
                                style={{color: 'white', backgroundColor: 'red'}}
                                onClick={() => this.hangUpCall()}
                            >
                                <Icon style={styles.buttonIcon}>call_end</Icon>
                                <span>Hang Up</span>
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button
                                fullWidth
                                size="large"
                                variant="contained"
                                color="primary"
                                onClick={() => this.toggleCallSound()}
                            >
                                <Icon style={styles.buttonIcon}>
                                    {this.state.muted ? 'volume_up' : 'volume_off'}
                                </Icon>
                                <span>{this.state.muted ? 'UnMute' : 'Mute'}</span>
                            </Button>
                        </Grid>
                    </Grid>
                )
            } else {
                return (
                    <Grid {...props}>
                        <Button
                            fullWidth
                            size="large"
                            variant="contained"
                            color="primary"
                            disabled={!phonePattern.test(this.state.phone)}
                            onClick={() => this.startCall()}
                        >
                            <Icon style={styles.buttonIcon}>phone</Icon>
                            <span>Call</span>
                        </Button>
                    </Grid>
                )
            }
        }
        
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
                            disabled={this.state.phone.length === 0}
                            onButtonClick={() => this.eraseLastChar()}
                            />
                        
                        <StatusBar
                            variant="subtitle1"
                            leftText={`Your caller ID: ${this.state.clientID}`}
                            rightText={elapsedTime !== null ? formatTime(elapsedTime) : ''}
                            />

                        <Dial onDial={(symbol) => this.applyDial(symbol)}/>

                        <CallControls style={{marginTop: 20}} />
                    </Paper>
                </Paper>
            </AppTheme>
        );
    }
}
