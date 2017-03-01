/*jslint browser: true*/
/*jslint jquery: true*/
/*global sageApp */

sageApp.modules.register("ux2Sticky", function ($) {
  "use strict";

  function init() {
    $(window).scroll(stickify);
    stickify();
  }

  function stickify() {
    $("[data-sticky-container]").each(function () {
      var top = this.getBoundingClientRect().top;

      if (top <= 0) {
        $(this).find("[data-sticky]:not(.sticky)").addClass("sticky");
      } else {
        $(this).find("[data-sticky].sticky").removeClass("sticky");
      }
    });
  }

  return {
    init: init
  }
});