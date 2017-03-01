/*jslint browser: true*/
/*jslint jquery: true*/
/*global sageApp */

sageApp.modules.register("articles", function ($) {
  "use strict";

  var resizeTimer;

  function init() {
    initEvents();
    initSlick();
  }

  function initEvents() {
    $(window).on("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        initSlick();
      }, 250);
    });
  }

  function initSlick() {
    $('.article-list').slick({
      dots: true,
      infinite: false,
      speed: 300,
      slidesToShow: 4,
      slidesToScroll: 4,
      arrows: false,
      variableWdith: false,
      responsive: [
        {
          breakpoint: 769,
          settings: {
            focusOnSelect: false,
            arrows: false,
            centerMode: false,
            slidesToShow: 2,
            slidesToScroll: 2,
            initialSlide: 1,
            dots: true
          }
        },
        {
          breakpoint: 375,
          settings: {
            focusOnSelect: false,
            centerMode: false,
            slidesToShow: 1,
            slidesToScroll: 1,
            initialSlide: 1,
            centerPadding: '40px',
            dots: true,
            arrows: false
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