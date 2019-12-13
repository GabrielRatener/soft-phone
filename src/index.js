
import ReactDOM from "react-dom"
import React from "react"
 
import App from "./components/app"

import {setup as setupDevice} from "./device"

window.onload = async () => {
    const app = React.createElement(App, null, []);

    try {
        await setupDevice();
        ReactDOM.render(app, document.getElementById('app-mount'));
    } catch (e) {
        // TODO: something else
    }
}
