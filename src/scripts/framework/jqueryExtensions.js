/*jslint browser: true*/
/*jslint jquery: true*/
/*global sageApp */

(function () {
    "use strict";

    window.$.extend($.expr[":"], {
        inView: isElementCompletelyInView,
        inPartialView: isElementPartiallyInView
    });

    function isElementCompletelyInView(element) {
        var rect = element.getBoundingClientRect();
        var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
        return rect.top >= 0 && rect.bottom < viewHeight;
    }

    function isElementPartiallyInView(element) {
        var rect = element.getBoundingClientRect();
        var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
        return (rect.top >= 0 && rect.top < viewHeight) || (rect.bottom >= 0 && rect.bottom < viewHeight);
    }
}());