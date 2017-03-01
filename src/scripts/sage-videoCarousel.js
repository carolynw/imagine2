/*jslint browser: true*/
/*jslint jquery: true*/
/*global sageApp */

sageApp.modules.register("videoCarousel", function ($) {
  "use strict";

  var eventTriggerSelectorClass = "video-control-play",
    eventTriggerSelectorStopClass = "video-control-stop",
    videoPlayingClass = "videoPlaying";

  function init() {
    //bind all events to document for delagation to traget enventTriggerSelector
    $(document).on("click", "." + eventTriggerSelectorClass, function (e) {
      e.preventDefault();
      playVideo($(this));
    });
    $(document).on("click", "." + eventTriggerSelectorStopClass, function (e) {
      e.preventDefault();
      stopVideo($(this));
    });
  }

  function playVideo(targetCarousel) {
    var activeSlide = targetCarousel.closest(".carousel").find(".item.active");
    targetCarousel.closest(".carousel").addClass(videoPlayingClass).carousel('pause');
    replaceVideoPlaceholder(activeSlide);
  }

  function stopVideo(targetCarousel) {
    var activeSlide = targetCarousel.closest(".carousel").find(".item.active");
    removeVideoPlaceholder(activeSlide);
    targetCarousel.closest(".carousel").removeClass(videoPlayingClass).carousel('cycle');
  }

  function removeVideoPlaceholder(activeSlide) {
    //clear iframe from slide
    activeSlide.find(".videoContainer").html("");
  }

  function replaceVideoPlaceholder(activeSlide) {
    var youtubeID = activeSlide.attr("data-video"),
      embedURL = "https://www.youtube.com/embed/" + youtubeID + "?autoplay=1&controls=0&showinfo=0",
      iframe = "<iframe frameborder='0' allowfullscreen='1' src='" + embedURL + "'></iframe>";
    //add iframe to slide
    activeSlide.find(".videoContainer").html(iframe);
  }

  return {
    init: init
  }
});