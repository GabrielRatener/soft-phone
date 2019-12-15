
import ReactDOM from "react-dom"
import React from "react"
 
import App from "./components/app"

window.onload = () => {
    const app = React.createElement(App, null, []);
    
    ReactDOM.render(app, document.getElementById('app-mount'));
}
