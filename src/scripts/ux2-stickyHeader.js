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
                $("[data-sticky-header]").addClass("ns");
            },
            exited: function () {
                $("[data-sticky-header]").removeClass("ns");
            }
        });
    }

    function updateStickiness() {
        var $stickyHeader = $("[data-sticky-header]");

        var top = $stickyHeader.parent()[0]
            .getBoundingClientRect()
            .top;

        if (top <= 0) {
            $stickyHeader.addClass("sticky");
        } else {
            $stickyHeader.removeClass("sticky");
        }

        // Set and record height offsets
        if ($stickyHeader.css("position") === "fixed") {
            var stickyHeight = $stickyHeader.height();
            $stickyHeader.parent().height(stickyHeight);
            $("body").data("top-offset", stickyHeight)
        } else {
            $stickyHeader.parent().height("auto");
            $("body").data("top-offset", 0)
        }
    }

    return {
        init: init
    }
});