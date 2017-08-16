var config = {
    // Name of built js-file
    jsFilename : 'app.js',
    // Port to run the application on
    port: 3000,
    // Webpack dev port to run on
    devPort: 3001,
    // Url for your go server
    goServerUrl: 'http://192.168.0.176:8153',
    // Go user to use for communication with go server
    goUser: undefined,
    // Password for go user
    goPassword: undefined,
    // How often data from go should be refreshed in seconds
    goPollingInterval: 30,
    // If > 0 switches between pipeline and test results page every n seconds
    switchBetweenPagesInterval: 0
}
module.exports = config;
