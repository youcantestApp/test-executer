exports.config = {
    port:4444,
    desiredCapabilities: [{
        browserName: 'phantomjs'
    }],
    logLevel: 'verbose',
    coloredLogs: true,
    screenshotPath: './errorShots/',
    waitforTimeout: 120000,
    onPrepare: function() {
        // do something
    },
    //
    // Gets executed before test execution begins. At this point you will have access to all global
    // variables like `browser`. It is the perfect place to define custom commands.
    before: function() {
        // do something
    },
    //
    // Gets executed after all tests are done. You still have access to all global variables from
    // the test.
    after: function() {
        // do something
    },
    //
    // Gets executed after all workers got shut down and the process is about to exit. It is not
    // possible to defer the end of the process using a promise.
    onComplete: function() {
        // do something
    }
};
