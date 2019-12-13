
import twilio from "twilio-client"

import {http} from "./utils"

const device = new twilio.Device();

export const status = {
    CALL_INACTIVE: 0,
    CALL_CONNECTING: 1,
    CALL_ACTIVE: 2
}

export const setup = async () => {
    const token = await http('services/access-token');

    device.setup(token, {});
}

export default device;
