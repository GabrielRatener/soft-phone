

import typescript from "rollup-plugin-typescript"

export default {
    input: './src/index.ts',
    output: {
        file: './public/dist/bundle.js',
        format: 'iife',
        globals: {
            'react': 'React',
            'react-dom': 'ReactDOM',
            '@material-ui/core': 'MaterialUI'
        }
    },

    plugins: [
        typescript()
    ]
}
