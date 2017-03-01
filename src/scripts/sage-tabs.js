/*jslint browser: true*/
/*jslint jquery: true*/
/*global sageApp */

sageApp.modules.register("tabs", function ($) {
  "use strict";

  var tabModuleClass = ".tab-control-id";

  function init() {
    var $tabs = $(tabModuleClass);

    if (!$tabs.length)
      return;

    /*bind tab mobile next click events*/
    $(document).on("click", tabModuleClass + " > .nav-tabs > .btnNext", function (e) {
      e.preventDefault();
      nextClicked(e.currentTarget);
    });
    /*bind tab mobile prev click events*/
    $(document).on("click", tabModuleClass + " > .nav-tabs > .btnPrevious", function (e) {
      e.preventDefault();
      prevClicked(e.currentTarget);
    });

    $tabs.each(function () {
      toggleNavButton($(this));
    });
  }

  function nextClicked(clickedNav) {
    var theNav = $(clickedNav).closest(tabModuleClass),
      theActiveNav = theNav.find(".nav-tabs > .active").first();

    /*Trigger click on the next tab*/
    $(theActiveNav).next('li').find('a').trigger('click');

    /*Toggle Nav next preivous disabled stated based on active tab*/
    toggleNavButton(theNav);
  }

  function prevClicked(clickedNav) {
    var theNav = $(clickedNav).closest(tabModuleClass),
      theActiveNav = theNav.find(".nav-tabs > .active").first();

    /*Trigger click on the previous tab*/
    $(theActiveNav).prev('li').find('a').trigger('click');

    /*Toggle Nav next preivous disabled stated based on active tab*/
    toggleNavButton(theNav);
  }

  function toggleNavButton(theNav) {
    var theActiveNav = theNav.find(".nav-tabs > .active").first(),
      prevItem = $(theActiveNav).prev("li"),
      nextItem = $(theActiveNav).next("li");

    if (prevItem.hasClass("navigation")) {
      prevItem.addClass("disabled");
    } else {
      $(theNav).find(".navigation.btnPrevious").first().removeClass("disabled");
    }
    if (nextItem.hasClass("navigation")) {
      nextItem.addClass("disabled");
    } else {
      $(theNav).find(".navigation.btnNext").first().removeClass("disabled");
    }
  }

  return {
    init: init
  }
});