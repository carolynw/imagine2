/*jslint browser: true*/
/*jslint jquery: true*/

(function () {
    "use strict";

    var sageApp = window.sageApp = (window.sageApp ? window.sageApp : {});

    sageApp.logger = (function () {
        function logInfo(message) {
            console.log(message);
            // todo: remote logging
        }

        function logWarn(message) {
            console.warn(message);
            // todo: remote logging
        }

        function logError(message) {
            console.error(message);
            // todo: remote logging
        }

        return {
            logInfo: logInfo,
            logWarn: logWarn,
            logError: logError
        }
    }());
}());