
import twilio from "twilio-client"

import {http} from "./utils"

const device = new twilio.Device();

export const getOutputDevices = () => {
    return navigator.mediaDevices.enumerateDevices()
        .then((devices) => {
            return devices
                .filter((device) => device.kind === 'audiooutput')
                .map(({label, deviceId: value}, i) => {
                    const title = label || `Output Device ${i + 1}`;
                    
                    return {title, value};
                });
        });
}

export const getInputDevices = () => {
    return navigator.mediaDevices.enumerateDevices()
        .then((devices) => {
            return devices
                .filter((device) => device.kind === 'audioinput')
                .map(({label, deviceId: value}, i) => {
                    const title = label || `Input Device ${i + 1}`;
                    
                    return {title, value};
                });
        });
}

export const setup = async () => {
    const token = await http('services/access-token');

    device.setup(token, {
        enableRingingState: true
    });
}

export default device;
