/*jslint browser: true*/
/*jslint jquery: true*/
/*global sageApp */

sageApp.modules.register("ux2Sticky", function ($) {
    "use strict";

    function init() {
        initStickyHeader();
    }

    function initStickyHeader() {
        $(window).resize(updateStickyHeader);
        $(window).scroll(updateStickyHeader);
        updateStickyHeader();

        $("[data-sticky-header]").on("click", "[data-toggle-nav-bar]", function (event) {
            event.preventDefault();
            $(event.delegateTarget).find("[data-nav-bar]").toggleClass("open");
            $(event.target).toggleClass("open");
        });
    }

    function updateStickyHeader() {
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