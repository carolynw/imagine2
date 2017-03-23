/*jslint browser: true*/
/*jslint jquery: true*/
/*global sageApp */

sageApp.modules.register("accordion", function ($) {
    "use strict";

    function init() {
        var $accordions = $("[data-accordion]");

        if (!$accordions.length)
            return;

        $accordions.on("shown.bs.collapse", maybeScrollToPanel);
    }

    function maybeScrollToPanel(event) {
        var $panel = $(event.target).parent(".panel").not(":inView");

        if (!$panel.length)
            return;

        var topOffset = $("body").data("top-offset") || 0;
        topOffset += 5;

        $("html,body").animate({
            scrollTop: $panel.offset().top - topOffset
        }, 500);
    }

    return {
        init: init
    }
});