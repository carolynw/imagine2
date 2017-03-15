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
        var $panel = $(event.target).parent(".panel");

        // We'll only scroll to the panel if the content is not entirely within view
        if (isElementInView($panel))
            return;

        var topOffset = $("body").data("top-offset") || 0;
        topOffset += 5;

        $("html,body").animate({
            scrollTop: $panel.offset().top - topOffset
        }, 500);
    }

    function isElementInView($element) {
        var rect = $element[0].getBoundingClientRect();
        var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
        return rect.top >= 0 && rect.bottom < viewHeight;
    }

    return {
        init: init
    }
});