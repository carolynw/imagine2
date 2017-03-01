/*jslint browser: true*/
/*jslint jquery: true*/
/*global sageApp */

sageApp.modules.register("solutions", function ($) {
  "use strict";

  var triggerItem = ".widget-placeholder-inner.solution",
    activeClass = "active",
    inactiveClass = "inactive";

  function init() {
    /*bind solution click events*/
    $(document).on("click", triggerItem, function (e) {
      e.preventDefault();
      solutionClicked(e.currentTarget);
    });
    $(document).on("click", ".solution-trig.active", function (e) {
      e.preventDefault();
      removeActive();
    });
  }

  function removeActive() {
    $(".solution-trig").removeClass("active").removeClass("inactive");
  }

  function solutionClicked(clickedItem) {
    var isActive = $(clickedItem).closest("div.border-top-bottom").hasClass(activeClass);

    if (isActive) {
      $(triggerItem).each(function () {
        $(this).closest("div.border-top-bottom").removeClass(inactiveClass).removeClass(activeClass);
      });
    } else {
      $(triggerItem).each(function () {
        $(this).closest("div.border-top-bottom").addClass(inactiveClass).removeClass(activeClass);
      });
      $(clickedItem).closest("div.border-top-bottom").removeClass(inactiveClass).addClass(activeClass);
    }
  }

  return {
    init: init
  }
});