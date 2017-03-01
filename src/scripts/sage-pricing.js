/*jslint browser: true*/
/*jslint jquery: true*/
/*global sageApp */

sageApp.modules.register("pricing", function ($) {
  "use strict";

  function init() {
    if (!$(".range-number").length)
      return;

    initClicks();
    initSlick();
  }

  function initClicks() {
    $(document).on("input change", ".range-number", function () {
      var output = $(this).prev('output'),
        theValue = $(this).val();
      $(this).attr("value", theValue);
      if (theValue <= 500) {
        output.html("Number of licences: " + theValue);
      } else {
        output.html("Number of licences: 500+");
      }
    });
  }

  function initSlick() {
    $("#sage_pricing_options").slick({
      dots: false,
      infinite: false,
      speed: 300,
      slidesToShow: 3,
      slidesToScroll: 1,
      focusOnSelect: false,
      arrows: false,
      initialSlide: 0,
      responsive: [
        {
          breakpoint: 767,
          settings: {
            focusOnSelect: true,
            centerMode: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            initialSlide: 1
          }
        }
        // You can unslick at a given breakpoint now by adding:
        // settings: "unslick"
        // instead of a settings object
      ]
    });
  }

  return {
    init: init
  }
});