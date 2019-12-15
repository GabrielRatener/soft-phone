
import twilio from "twilio-client"
import {http} from "./utils"

const device = new twilio.Device();

const deviceReady = () => {
    return new Promise((resolve, reject) => {
        device.on('ready', () => resolve());

        device.on('error', (err) => reject(err));
    });
}

export const setup = async () => {
    const token = await http('services/access-token');

    device.setup(token, {
        enableRingingState: true
    });

    await deviceReady();
}

export default device;
