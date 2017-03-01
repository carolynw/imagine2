/*jslint browser: true*/
/*jslint jquery: true*/
/*global sageApp */

sageApp.modules.register("productFeature", function ($) {
  "use strict";

  var productDevice = {},
    modScopeId = ".product-example";

  function init() {
    $(document).on("click", ".tab-control-id .device-nav > div", function (e) {
      e.preventDefault();
      deviceClick(e.currentTarget);
    });

    $(window).on("resize", resizeBehaviour);

    if (!$(modScopeId).length)
      return;

    $(".tab-control-id .tab-pane").each(function () {
      $(this).find(".device-nav div:first").addClass("active");

      $(this).find(".product-example").each(function () {
        var currentWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        showCorrectScreenshot(currentWidth, this);
      });
    });
  }

  function showCorrectScreenshot(currentWidth, target) {
    var phoneScreenshot = $(target).find(".phone-img").length >= 1;
    var tabletScreenshot = $(target).find(".tablet-img").length >= 1;
    var laptopScreenshot = $(target).find(".laptop-img").length >= 1;

    if (currentWidth <= 767) {
      $(target).find("img").removeClass("visible-important");
      if (phoneScreenshot) {
        $(target).find(".phone-img").addClass("visible-important");
      } else if (tabletScreenshot) {
        $(target).find(".tablet-img").addClass("visible-important");
      } else if (laptopScreenshot) {
        $(target).find(".laptop-img").addClass("visible-important");
      }
    } else if (currentWidth > 767 && currentWidth <= 992) {
      $(target).find("img").removeClass("visible-important");
      if (tabletScreenshot) {
        $(target).find(".tablet-img").addClass("visible-important");
      } else if (phoneScreenshot) {
        $(target).find(".phone-img").addClass("visible-important");
      } else if (laptopScreenshot) {
        $(target).find(".laptop-img").addClass("visible-important");
      }
    } else if (currentWidth >= 992) {
      $(target).find("img").removeClass("visible-important");
      if (laptopScreenshot) {
        $(target).find(".laptop-img").addClass("visible-important");
      } else if (tabletScreenshot) {
        $(target).find(".tablet-img").addClass("visible-important");
      } else if (phoneScreenshot) {
        $(target).find(".phone-img").addClass("visible-important");
      }
    }
  }

  function deviceClick(clickedItem) {
    var allButtons = $(".device-nav div.active");
    allButtons.each(function () {
      $(this).removeClass("active");
    });

    var clickedClass = $(clickedItem).attr("class");
    var allRelatedButtons = $("." + clickedClass);
    allRelatedButtons.each(function () {
      $(this).addClass("active");
    });

    $(".visible-important").addClass("hidden-important").removeClass("visible-important");

    //current device class to show on all tabs
    var imgClass = "." + $(clickedItem).attr("class").substring(0, $(clickedItem).attr("class").indexOf("-")) + "-img";

    $(imgClass).each(function () {
      $(this).removeClass("hidden-important");
      $(this).addClass("visible-important");
    });
  }

  function resizeBehaviour() {
    clearTimeout(productDevice.resizeTimer);
    productDevice.resizeTimer = setTimeout(function () {
      var productFeatureTabsId = "#" + $(".tab-control-id .device-nav").parents(".tab-pane").parents(".tab-control-id").attr("id");
      $(productFeatureTabsId + " .tab-pane").each(function () {
        $(this)
          .find(".product-example img.hidden-important")
          .each(function () {
            $(this).removeClass("hidden-important");
          });
        $(this)
          .find(".product-example img.visible-important")
          .each(function () {
            $(this).removeClass("visible-important");
          });
        $(this)
          .find(".product-example img:first-child")
          .each(function () {
            $(this).addClass("visible-important");
          });
        $(this)
          .find(".device-nav div.active")
          .each(function () {
            $(this).removeClass("active");
          });
        $(this)
          .find(".device-nav")
          .each(function () {
            $(this).find("div").first().addClass("active");
          });
        $(this)
          .find(".product-example")
          .each(function () {
            var currentWidth = window.innerWidth ||
              document.documentElement.clientWidth ||
              document.body.clientWidth;
            showCorrectScreenshot(currentWidth, this);
          });
      });
    }, 50);
  }

  return {
    init: init
  }
});