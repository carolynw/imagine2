/*jslint jquery: true*/
/*global sageApp */

sageApp.modules.register("sideNav", function ($) {
    "use strict";

    function init() {
        var $body = $("body");
        var $sideNav = $("#ux2_side_nav");

        $body.on("click", "[data-sidenav='open']", function (event) {
            event.preventDefault();
            $body.addClass("no-scroll").addClass("blur-all");
            $sideNav.addClass("open");
        });

        $body.on("click", "[data-sidenav='close']", function (event) {
            event.preventDefault();
            $body.removeClass("no-scroll").removeClass("blur-all");
            $sideNav.removeClass("open");
        });

        $sideNav.on("click", ".section-header", function (event) {
            event.preventDefault();
            $(this).closest(".section").toggleClass("open");
        })
    }

    return {
        init: init
    }
});