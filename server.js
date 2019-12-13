
// Basic server for serving files and generating auth tokens

const http = require('http');
const express = require('express');
const twilio = require('twilio');

const {
    accountSid,
    applicationSid,
    authToken,
} = require('./twilio-config.json');

const {ClientCapability} = twilio.jwt;

const app = express();

const start = (port) => {
    return new Promise((resolve, reject) => {
        http
            .createServer(app)
            .listen(port, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
    });
}

app.use(express.static('public'));

app.get('/services/access-token', (req, res) => {

    const capability = new ClientCapability({
        accountSid,
        authToken
    });

    const scope = new ClientCapability.OutgoingClientScope({
        applicationSid
    });

    capability.addScope(scope);

    res.set('content-type', 'application/jwt');
    res.send(capability.toJwt());
});

module.exports = {
    start
};
