/*jslint browser: true*/
/*jslint jquery: true*/
/*global sageApp */

sageApp.modules.register("customerStories", function ($) {
  "use strict";

  function init() {
    if (!$(".button-white.play").length)
      return;

    var $carousel = $("#customer_story_tab_carousel");

    $carousel.find(".item").each(function () {
      var id = "#" + $(this).attr("id");
      $(this).find(".button-white.play").each(function () {
        $(this).click(function () {
          $(this).closest(".carousel").carousel('pause');
          var videoId = $(id + " .video-container").data("videoid");
          var iframe = '<iframe class="" ' + 'width="100%" height="420" src="https://www.youtube.com/embed/' + videoId + '?rel=0&autoplay=1&enablejsapi=1" frameborder="0" allowfullscreen></iframe>';
          var iframeExist = $(id + " .video-container").find("iframe").length;

          if (!iframeExist) {
            $(id + " .video-container").append(iframe);
          } else {
            $(id + ' iframe')[0].contentWindow.postMessage('{"event":"command","func":"' + 'playVideo' + '","args":""}', '*');
          }

          $(id + ' .hide-on-play').addClass('hidden');
          $(id + ' .show-on-play').removeClass('hidden');
          $('ol.carousel-indicators').addClass('hidden');
          $(id + ' .proper-focus').removeClass('proper-focus').addClass('blurred');

        });
      });
      $(this).find(".button-white-back.back-to").each(function () {
        $(this).click(function () {
          $(this).closest(".carousel").carousel('cycle');
          $(id + ' .hide-on-play').removeClass('hidden');
          $(id + ' .show-on-play').addClass('hidden');
          $('ol.carousel-indicators').removeClass('hidden');
          $(id + ' .blurred').removeClass('blurred').addClass('proper-focus');
          $(id + ' iframe')[0].contentWindow.postMessage('{"event":"command","func":"' + 'pauseVideo' + '","args":""}', '*');
        });
      });
    });

    $carousel.carousel({interval: 10000});
  }

  return {
    init: init
  }
});