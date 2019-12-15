
const fs = require('fs');

const {$} = require('jolt.sh');

const server = require('./server');

const copyLibsToPublic = (dev = false) => {
    const extension = dev ? 'development.js' : 'production.min.js';
    
    const paths = [
        {
            npm: `react/umd/react.${extension}`,
            public: `react.js`
        },
        {
            npm: `react-dom/umd/react-dom.${extension}`,
            public: `public/dist/react-dom.js`
        },
        {
            npm: `@material-ui/core/umd/material-ui.${extension}`,
            public: `material-ui.js`
        },
        {
            npm: `node_modules/twilio-client/dist/twilio.${dev ? 'js' : 'min.js'}`,
            public: `twilio.js`
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
    await server.start(port);
    console.log(`HTTP server started on port ${port}`);
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
