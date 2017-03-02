/*jslint browser: true*/
/*jslint jquery: true*/
/*global sageApp */

sageApp.modules.register("ux2Sticky", function ($) {
  "use strict";

  function init() {
    // todo: ideally we want to switch over to using bootstrap affix but that seemed buggy...
    $(window).resize(stickify);
    $(window).scroll(stickify);
    stickify();
  }

  function stickify() {
    $("[data-sticky-container]").each(function () {
      var $stickyContainer = $(this);
      var $sticky = $stickyContainer.find("[data-sticky]");

      $stickyContainer.height($sticky.height());

      var top = this.getBoundingClientRect().top;

      if (top <= 0) {
        $sticky.addClass("sticky");
      } else {
        $sticky.removeClass("sticky");
      }
    });
  }

  return {
    init: init
  }
});