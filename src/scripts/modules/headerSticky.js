/*jslint browser: true*/
/*jslint jquery: true*/
/*global sageApp */

sageApp.modules.register("headerSticky", function ($) {
    "use strict";

    var $headerSticky;

    function init() {
        $headerSticky = $("#header-sticky");

        if (!$headerSticky.length)
            return;

        update();
        attachEvents();
    }

    function attachEvents() {
        // Todo: throttle these?
        $(window).resize(update);
        $(window).scroll(update);

        $headerSticky.on("click", "[data-toggle-nav-bar]", function (event) {
            event.preventDefault();
            $(event.delegateTarget).find("[data-nav-bar]").toggleClass("open");
            $(event.target).toggleClass("open");
        });
    }

    function update() {
        updateVisibility();
        updateStickiness();
    }

    function updateVisibility() {
        var shouldBeVisible = $("[data-sticky-header-hider]:inPartialView").length > 0;

        if (shouldBeVisible) {
            $headerSticky
                .addClass("no-vis");
        }
        else {
            $headerSticky
                .removeClass("no-vis");
        }
    }

    function updateStickiness() {
        var contentsHeight = $headerSticky.find(">.sticky-header-content").height();
        $("body").data("top-offset", contentsHeight);

        var shouldBeSticky = $headerSticky[0]
                .getBoundingClientRect()
                .top < 0;

        if (shouldBeSticky) {
            $headerSticky
                .addClass("sticky")
                .height(contentsHeight);
        } else {
            $headerSticky
                .removeClass("sticky")
                .height("auto");
        }
    }

    return {
        init: init
    }
});