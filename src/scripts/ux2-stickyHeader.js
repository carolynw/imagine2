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
        $("[data-sticky-header-hider]").each(function (i, element) {
            new Waypoint.Inview({
                element: element,
                entered: function () {
                    $("[data-sticky-header]").addClass("ns");
                },
                exited: function () {
                    $("[data-sticky-header]").removeClass("ns");
                }
            });
        });
    }

    function updateStickiness() {
        var $stickyHeader = $("[data-sticky-header]");
        var $stickyContainer = $stickyHeader.parent();

        var top = $stickyContainer[0]
            .getBoundingClientRect()
            .top;

        if (top <= 0) {
            $stickyHeader.addClass("sticky");
            $stickyContainer.height($stickyHeader.height());
        } else {
            $stickyHeader.removeClass("sticky");
            $stickyContainer.height("auto");
        }
    }

    return {
        init: init
    }
});