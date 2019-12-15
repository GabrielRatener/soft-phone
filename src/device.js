
import twilio from "twilio-client"
import {http} from "./utils"

const device = new twilio.Device();

export const setup = async () => {
    const token = await http('services/access-token');

    device.setup(token, {
        enableRingingState: true
    });
}

export default device;
