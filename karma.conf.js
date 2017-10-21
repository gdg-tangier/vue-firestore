var path = require('path')

module.exports = function(config) {
    config.set({
        frameworks: ['mocha', 'sinon-chai'],
        browsers: ['PhantomJS'],
        reporters: ['spec', 'coverage'],
        files: [
            'tests/vue-firestore.spec.js'
        ],
        preprocessors: {
            'tests/vue-firestore.spec.js': ['webpack', 'sourcemap']
        },
        client: {
            mocha: {
                timeout: 10000
            }
        },
        webpack: {
            devtool: '#inline-source-map',
            module: {
                loaders: [{
                    include: path.resolve(__dirname, 'src/main.js'),
                    loader: 'istanbul-instrumenter-loader'
                }]
            }
        },
        webpackMiddleware: {
            noInfo: true
        },
        coverageReporter: {
            reporters: [
                { type: 'lcov', subdir: '.' },
                { type: 'text-summary' }
            ]
        }
    })
}