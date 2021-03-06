// Karma configuration file, see link for more information
// https://karma-runner.github.io/0.13/config/configuration-file.html

module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine', '@angular/cli'],
        plugins: [
            require('karma-jasmine'),
            require('karma-chrome-launcher'),
            require('karma-firefox-launcher'),
            require('karma-jasmine-html-reporter'),
            require('@angular/cli/plugins/karma')
        ],
        files: [
            // Include support libraries and angular material
            { pattern: './src/test.ts', watched: false },
            // Pull in the neon-gtd version file.  Do NOT include it in the test rig via a <script> tag.
            { pattern: './src/app/config/version.json', watched: false, included: false },
            // Required by Angular
            'node_modules/@angular/material/prebuilt-themes/purple-green.css'
        ],
        preprocessors: {
            './src/test.ts': ['@angular/cli']
        },
        angularCli: {
            config: './angular-cli.json',
            environment: 'dev'
        },
        mime: {
            'text/x-typescript': ['ts','tsx']
        },
        reporters: ['progress'],
        browserDisconnectTimeout: 60000,
        browserDisconnectTolerance: 3,
        browserNoActivityTimeout: 100000,
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        browsers: ['ChromeHeadless', 'FirefoxHeadless'],
        customLaunchers: {
            FirefoxHeadless: {
                base: 'Firefox',
                flags: [ '-headless' ],
              },
        },
        singleRun: true,
        client: {
            captureConsole: true,
            clearContext: false
        }
    });
};
