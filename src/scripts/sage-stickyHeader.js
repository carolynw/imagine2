/*jslint browser: true*/
/*jslint jquery: true*/
/*global sageApp */

sageApp.modules.register("stickyHeader", function ($) {
    "use strict";

    var $stickyHeader;

    function init() {
        $stickyHeader = $("[data-sticky-header]");

        if (!$stickyHeader.length)
            return;

        update();
        attachEvents();
    }

    function attachEvents() {
        $(window).resize(update);
        $(window).scroll(update);

        $stickyHeader.on("click", "[data-toggle-nav-bar]", function (event) {
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
        var shouldStickyHeaderBeVisible = $("[data-sticky-header-hider]:inPartialView").length > 0;

        if (shouldStickyHeaderBeVisible)
            $stickyHeader.addClass("no-vis");
        else
            $stickyHeader.removeClass("no-vis");
    }

    function updateStickiness() {
        var contentsHeight = $stickyHeader.find(">.sticky-header-content").height();
        $("body").data("top-offset", contentsHeight);

        var top = $stickyHeader[0]
            .getBoundingClientRect()
            .top;

        if (top < 0) {
            $stickyHeader
                .addClass("sticky")
                .height(contentsHeight);
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