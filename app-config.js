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
    goUser: 'rms',
    // Password for go user
    goPassword: 'rms',
    // How often data from go should be refreshed in seconds
    goPollingInterval: 30,
    // If > 0 switches between pipeline and test results page every n seconds
    switchBetweenPagesInterval: 0,
    // Whether to display build labels
    showBuildLabels: true,
    // Whether to group pipelines
    groupPipelines: false
}
module.exports = config;
