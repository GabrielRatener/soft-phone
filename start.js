
const {$, run} = require('jolt.sh');

const main = (script, args = []) => {
    switch (script) {
        case 'postinstall':
            const extension =
                (args.length > 0 && args[0] === 'production') ?
                    'production.min.js' :
                    'development.js';
            
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
                    npm: `node_modules/@material-ui/core/umd/material-ui.${extension}`,
                    public: `public/dist/material-ui.js`
                }
            ];
            
            $`mkdir public/dist`;

            paths.forEach((path) => {
                $`cp ${path.npm} ${path.public}`;
            });

            $`webpack-cli --production`;

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