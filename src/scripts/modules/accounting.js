/*jslint browser: true*/
/*jslint jquery: true*/
/*global sageApp */

sageApp.modules.register("accounting", function ($) {
    "use strict";

    function init() {

        setTimeout(function () { $("#phone_fan, .accounting-module").toggleClass("open"); }, 500);
        
    }

    return {
        init: init
    };
});