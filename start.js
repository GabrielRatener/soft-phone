
const fs = require('fs');
const http = require('http');

const {$} = require('jolt.sh');
const express = require('express');
const {jwt: {ClientCapability}} = require('twilio');

// Create a mini web-server for serving files
// and generating Twilio capability tokens
const startServer = (port) => {
    const app = express();

    const {
        accountSid,
        applicationSid,
        authToken,
    } = require('./twilio-config.json');

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

const copyLibsToPublic = (dev = false) => {
    const extension = dev ? 'development.js' : 'production.min.js';
    
    // large dependencies aren't bundled, and instead referenced externally
    const paths = [
        {
            npm: `react/umd/react.${extension}`,
            public: `react.js`
        },
        {
            npm: `react-dom/umd/react-dom.${extension}`,
            public: `react-dom.js`
        },
        {
            npm: `@material-ui/core/umd/material-ui.${extension}`,
            public: `material-ui.js`
        }
    ];

    if (!fs.existsSync('public/dist')) {
        $`mkdir public/dist`;
    }

    paths.forEach((path) => {
        const npmPath = `node_modules/${path.npm}`;
        const publicPath = `public/dist/${path.public}`;

        $`cp ${npmPath} ${publicPath}`;
    });
}

const serve = async (port) => {
    if (fs.existsSync('./twilio-config.json')) {
        await startServer(port);
        console.log(`HTTP server started on port ${port}`);    
    } else {
        console.error('Missing "twilio-config.json" file');
        process.exit(0);
    }
}

const main = async (script, args = []) => {
    switch (script) {
        case 'postinstall':
            copyLibsToPublic();

            $`webpack-cli --production`;

            return;

        case 'dev': // start dev process (local server + webpack watch)
            await serve(args.length > 0 ? parseInt(args[0]) : 8080);

            $`webpack-cli -w`;

            return;

        case 'prod':
            $`webpack-cli --production`;
            serve(args.length > 0 ? parseInt(args[0]) : 80);

            return;

        case 'server':
            serve(args.length > 0 ? parseInt(args[0]) : 8080);

            return;
            
        default:
            console.error(`Script "${script}" not defined.`);
    }
}


if (process.argv.length > 2) {
    const [script, ...args] = process.argv.slice(2);

    main(script, args);
} else {
    console.error("No script specified");
}
