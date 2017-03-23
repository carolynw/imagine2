/*jslint browser: true*/
/*jslint jquery: true*/
/*global sageApp */

sageApp.modules.register("headerSearch", function ($) {
    "use strict";

    var $headerSearch;

    function init() {
        $headerSearch = $("#header-search");

        if (!$headerSearch.length)
            return;

        attachEvents();
    }

    function attachEvents() {
        $("body")
            .on("click.header-search", "[data-header-search='open']", showSearch)
            .on("click.header-search", "[data-header-search='close']", hideSearch);
    }

    function showSearch(event) {
        event.preventDefault();

        $(event.delegateTarget)
            .on("click.header-search-autoclose", maybeHideSearch)
            .addClass("no-scroll")
            .scrollTop(0);

        $headerSearch
            .addClass("open");
    }

    function hideSearch(event) {
        event.preventDefault();

        $(event.delegateTarget)
            .removeClass("no-scroll")
            .off("click.header-search-autoclose");

        $headerSearch
            .removeClass("open");
    }

    function maybeHideSearch(event) {
        var isClickOnSearchBar = $(event.target).is("#header-search .bar, #header-search .bar *");

        if (!isClickOnSearchBar)
            hideSearch(event);
    }

    return {
        init: init
    }
});