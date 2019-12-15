
import {Component} from "react"

import {
    AppBar,
    Tabs,
    Tab,
    Paper,
    Icon,
    Button,
    Grid,
    Typography
} from "@material-ui/core"

import {formatTime} from "../utils"
import device, {setup as setupDevice} from "../device"

import StatusBar from "./status-bar"
import NumberField from "./number-field"
import Dial from "./dial"
import SelectDevice from "./select-device"
import OnlineStatus from "./online-status"

const phonePattern = /^\d{10}$/;

const styles = {
    root: {
        padding: 0,
        maxWidth: 400,
        position: 'relative'
    },
    buttonIcon: {
        paddingRight: 5
    },
    deviceSelect: {
        width: '48%',
        padding: '1%'
    },
    statusBar: {
        marginTop: 10,
        marginBottom: 10
    }
}

export const tabs = {
    CALL: 0,
    SMS: 1
}

export default class SoftPhone extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tabIndex: tabs.CALL,

            outputDevices: [],    
            inputDevices: [],

            settings: {
                audioInput: null,
                audioOutput: null,
                audioMuted: false
            },

            clientID: 'some-fake-id',
            phone: '',

            // is browser online
            online: navigator.onLine,

            // can be 'closed', 'pending' or 'open'
            callStatus: 'closed',

            // this is null when no call is active
            call: null, // {phone: <phone number>, start}

            _interval: null // for updating current time...
        }
    }

    componentWillMount() {
        const init = () => {
            initialized = true;

            setupDevice()
                .then(() => {
                    const outputDevices =
                        Array
                            .from(device.audio.availableOutputDevices.values())
                            .map(({deviceId, label}, i) => ({
                                title: label || `Speaker ${i + 1}`,
                                value: deviceId
                            }));

                    const inputDevices =
                        Array
                            .from(device.audio.availableInputDevices.values())
                            .map(({deviceId, label}, i) => ({
                                title: label || `Mic ${i + 1}`,
                                value: deviceId
                            }));

                    this.setState({
                        online: true,
                        outputDevices,
                        inputDevices
                    });
                }, (err) => {
                    initialized = false;

                    // oooops, something bad happened
                    console.log('Failed to setup device');
                });
        }

        let initialized = false;

        window.addEventListener('online', () => {
            this.setState({
                online: true
            });

            if (!initialized) {
                init();
            }
        });

        window.addEventListener('offline', () => {
            this.setState({
                online: false
            });
        });

        if (this.state.online) {
            init();
        }
    }

    setOutputDevice(id) {

        device.audio.speakerDevices.set(id);

        this.setState({
            settings: {
                ...this.state.settings,
                audioOutput: id
            }
        });
    }

    setInputDevice(id) {

        device.audio.setInputDevice(id);

        this.setState({
            settings: {
                ...this.state.settings,
                audioInput: id
            }
        });
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
        if (this.state.callStatus === 'closed') {
            if (this.state.phone.length < 10 && /\d/.test(symbol)) {
                this.setState({
                    phone: `${this.state.phone}${symbol}`
                });
            }
        } else {
            this.state.call._connection.sendDigits(symbol);
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
                phone: '',
                callStatus: 'closed',
                call: null,

                _interval: null
            });
        });

        this.setState({
            callStatus: 'pending',
            call: {
                start: null,
                phone: this.state.phone,
                _connection: connection
            }
        });
    }

    hangUpCall() {
        this.state.call._connection.disconnect();
    }

    toggleCallSound() {
        const audioMuted = !this.state.settings.audioMuted;

        // mute the mic
        this.state.call._connection.mute(audioMuted);

        this.setState({
            settings: {
                ...this.state.settings,
                audioMuted
            }
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
                                    {
                                      this.state.settings.audioMuted ?
                                        'volume_up' :
                                        'volume_off'
                                    }
                                </Icon>
                                <span>
                                    {
                                      this.state.settings.audioMuted ?
                                        'UnMute' :
                                        'Mute'
                                    }
                                </span>
                            </Button>
                        </Grid>
                    </Grid>
                )
            } else {
                return (
                    <Button
                        fullWidth
                        size="large"
                        variant="contained"
                        color="primary"
                        disabled={
                            !this.state.online ||
                            !phonePattern.test(this.state.phone)
                        }
                        onClick={() => this.startCall()}

                        {...props}
                    >
                        <Icon style={styles.buttonIcon}>phone</Icon>
                        <span>Call</span>
                    </Button>
                )
            }
        }
        
        return (
            <Paper square elevation={4} style={styles.root}>
                
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
                    {
                        (this.state.outputDevices.length > 0) ?
                            <SelectDevice
                                title="Output Device"
                                style={styles.deviceSelect}
                                devices={this.state.outputDevices}
                                onSelect={(value) => this.setOutputDevice(value)}
                                /> :
                            null
                    }

                    {
                        (this.state.inputDevices.length > 0) ?
                            <SelectDevice
                                title="Input Device"
                                style={styles.deviceSelect}
                                devices={this.state.inputDevices}
                                onSelect={(value) => this.setInputDevice(value)}
                                /> :
                            null
                    }

                    <NumberField
                        value={this.state.phone}
                        icon={<Icon>backspace</Icon>}
                        disabled={
                            this.state.phone.length === 0 ||
                            this.state.callStatus !== 'closed'
                        }
                        onButtonClick={() => this.eraseLastChar()}
                        />
                    
                    <StatusBar
                        variant="subtitle1"
                        leftContent={`Your caller ID: ${this.state.clientID}`}
                        rightContent={
                          this.state.callStatus === 'open' ?
                            <span>{formatTime(elapsedTime)}</span> :
                            <OnlineStatus variant="subtitle1" value={this.state.online} />
                        }
                        style={styles.statusBar}
                        />

                    <Dial onDial={(symbol) => this.applyDial(symbol)} />

                    <CallControls style={{marginTop: 20}} />
                </Paper>
            </Paper>
        );
    }
}
