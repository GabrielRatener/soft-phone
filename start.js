
const fs = require('fs');
const http = require('http');

const {$} = require('jolt.sh');

const server = require('./server');



const copyLibsToPublic = (dev = false) => {
    const extension = dev ? 'development.js' : 'production.min.js';
     
    const paths = [
        {
            npm: `node_modules/react/umd/react.${extension}`,
            public: `public/dist/react.js`
        },
        {
            npm: `node_modules/react-dom/umd/react-dom.${extension}`,
            public: `public/dist/react-dom.js`
        },
        {
            npm: `node_modules/react-redux/dist/react-redux.${dev ? 'js' : 'min.js'}`,
            public: `public/dist/react-redux.js`
        },
        {
            npm: `node_modules/@material-ui/core/umd/material-ui.${extension}`,
            public: `public/dist/material-ui.js`
        }
    ];

    if (!fs.existsSync('public/dist')) {
        $`mkdir public/dist`;
    }

    paths.forEach((path) => {
        $`cp ${path.npm} ${path.public}`;
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
