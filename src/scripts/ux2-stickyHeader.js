/*jslint browser: true*/
/*jslint jquery: true*/
/*global sageApp */

sageApp.modules.register("stickyHeader", function ($) {
    "use strict";

    function init() {
        if (!$("[data-sticky-header]").length)
            return;

        updateStickiness();
        attachEvents();
        initHiders();
    }

    function attachEvents() {
        $(window).resize(updateStickiness);
        $(window).scroll(updateStickiness);

        $("[data-sticky-header]").on("click", "[data-toggle-nav-bar]", function (event) {
            event.preventDefault();
            $(event.delegateTarget).find("[data-nav-bar]").toggleClass("open");
            $(event.target).toggleClass("open");
        });
    }

    function initHiders() {
        var $hider = $("[data-sticky-header-hider]");

        if (!$hider.length)
            return;

        new Waypoint.Inview({
            element: $hider[0],
            entered: function () {
                $("[data-sticky-header]").addClass("no-vis");
            },
            exited: function () {
                $("[data-sticky-header]").removeClass("no-vis");
            }
        });
    }

    function updateStickiness() {
        var $stickyHeader = $("[data-sticky-header]");
        var $inner = $stickyHeader.find(">:first-child");
        var innerHeight = $inner.height();
        $("body").data("top-offset", innerHeight);

        var top = $stickyHeader[0]
            .getBoundingClientRect()
            .top;

        if (top < 0) {
            $stickyHeader
                .addClass("sticky")
                .height(innerHeight);
        } else {
            $stickyHeader
                .removeClass("sticky")
                .height("auto");
        }
    }

    return {
        init: init
    }
});