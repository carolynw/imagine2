/*jslint browser: true*/
/*jslint jquery: true*/
/*global sageApp */

sageApp.modules.register("switcher", function ($) {
  "use strict";

  var modScopeId = "#the_switcher",
    leftNav = ".the-switcher-nav-left",
    rightNav = ".the-switcher-nav-right",
    switcherContent = ".the-switcher-content",
    activeClass = "active";

  function init() {
    /*bind left Nav click events*/
    $(document).on("click", modScopeId + " " + leftNav + " ul > li > a", function (e) {
      e.preventDefault();
      leftNavClicked(e.currentTarget);
    });

    /*bind right Nav click events*/
    $(document).on("click", modScopeId + " " + rightNav + " ul > li > a", function (e) {
      e.preventDefault();
      rightNavClicked(e.currentTarget);
    });

    /*bind All Nav next click events*/
    $(document).on("click", modScopeId + " " + rightNav + " li.btnNext ," + modScopeId + " " + leftNav + " li.btnNext", function (e) {
      var activeItem = $(e.currentTarget).parent("ul").find("li." + activeClass);
      e.preventDefault();
      activeItem.next('li').find('a').trigger('click');
      toggleNavButton($(e.currentTarget).closest("ul").attr('id'));
    });

    /*bind All Nav previous click events*/
    $(document).on("click", modScopeId + " " + rightNav + " li.btnPrevious ," + modScopeId + " " + leftNav + " li.btnPrevious", function (e) {
      var activeItem = $(e.currentTarget).parent("ul").find("li." + activeClass);
      e.preventDefault();
      activeItem.prev('li').find('a').trigger('click');
      toggleNavButton($(e.currentTarget).closest("ul").attr('id'));
    });

    if (!$(modScopeId).length)
      return;

    $(modScopeId).find(leftNav + " > ul" + ", " + rightNav + " > ul").each(function () {
      toggleNavButton($(this).attr("id"));
    });
  }

  function removeAllActiveLi(itemSelector) {
    $(itemSelector).find("li." + activeClass).removeClass(activeClass);
  }

  function removeAllActiveUl(itemSelector) {
    $(itemSelector).find("ul." + activeClass).removeClass(activeClass);
  }

  function updateTabContent() {
    var activeContent = $(modScopeId + " " + rightNav + " > ul." + activeClass + " > li." + activeClass + " > a").attr("href");
    $(modScopeId + " " + switcherContent + " > div." + activeClass).removeClass(activeClass);
    $(modScopeId + " " + switcherContent + " > " + activeContent).addClass(activeClass);
  }

  function rightNavClicked(eventItem) {
    removeAllActiveLi(modScopeId + " " + rightNav + " ul." + activeClass);
    $(eventItem).closest("li").addClass(activeClass);
    updateTabContent();
  }

  function leftNavClicked(eventItem) {
    var selectedTarget;
    selectedTarget = $(eventItem).attr("href");
    removeAllActiveLi(modScopeId + " " + leftNav);
    $(eventItem).closest("li").addClass(activeClass);
    removeAllActiveUl(modScopeId + " " + rightNav);
    $(selectedTarget).addClass(activeClass);
    updateTabContent();
  }

  function toggleNavButton(currentNav) {
    var active = $("#" + currentNav + " > li." + activeClass);
    var prevItem = active.prev('li');
    var nextItem = active.next('li');

    if (prevItem.hasClass("navigation")) {
      prevItem.addClass("disabled");
    } else {
      $("#" + currentNav + " .navigation.btnPrevious").removeClass("disabled");
    }
    if (nextItem.hasClass("navigation")) {
      nextItem.addClass("disabled");
    } else {
      $("#" + currentNav + " .navigation.btnNext").removeClass("disabled");
    }
  }

  return {
    init: init
  }
});