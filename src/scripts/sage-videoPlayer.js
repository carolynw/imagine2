/*jslint browser: true*/
/*jslint jquery: true*/
/*global sageApp */

sageApp.modules.register("videoPlayer", function ($) {
  "use strict";

  var videoModuleContainerClass = ".content-widget.video",
    eventTriggerSelectorClass = "video-container",
    videoPlayingClass = "video-playing",
    pauseVideoTriggerClasses = ".nav.nav-tabs > li:not(.active), .the-switcher-nav li:not(.active)",
    chapterTrigger = ".video-chapters-list li:not(.playing)";

  function init() {
    //bind all events to document for delegation to target eventTriggerSelector
    $(document).on("click", "." + eventTriggerSelectorClass, function (e) {
      e.preventDefault();
      playVideo($(this));
    });
    $(document).on("click", pauseVideoTriggerClasses, function () {
      pauseAllVideos();
    });
    $(document).on("click", chapterTrigger, function (e) {
      e.preventDefault();
      playChapter(e.currentTarget);
    });
  }

  function playVideo(targetVideo, startTime) {
    startTime = startTime >= 1 ? startTime : 0;
    if (!targetVideo.hasClass(videoPlayingClass)) {
      targetVideo.addClass(videoPlayingClass);
      addVideoPlaceholder(targetVideo, startTime);
    }
  }

  function pauseAllVideos() {
    $(document).find("iframe.video-iframe").each(function () {
      //$(this)[0].contentWindow.postMessage("{'event':'command','func':'pauseVideo','args':''}", "*");
      var tmpData = {
        event: "command",
        func: "pauseVideo",
        args: []
      };
      $(this)[0].contentWindow.postMessage(JSON.stringify(tmpData), "*");
    });
  }

  function addVideoPlaceholder(targetVideo, startTime) {
    startTime = startTime >= 1 ? startTime : (targetVideo.attr("data-start") >= 1 ? targetVideo.attr("data-start") : 0);
    var youtubeId = targetVideo.attr("data-videoid"),
      youtubeAutoPlay = targetVideo.attr("data-autoplay") ? targetVideo.attr("data-autoplay") : "0",
      youtubeAllowFullScreen = targetVideo.attr("data-allowfullscreen") ? targetVideo.attr("data-allowfullscreen") : "0",
      youtubeRelated = targetVideo.attr("data-related") ? targetVideo.attr("data-related") : "0",
      youtubeShowinfo = targetVideo.attr("data-showinfo") ? targetVideo.attr("data-showinfo") : "0",
      youtubeShowcontrols = targetVideo.attr("data-showcontrols") ? targetVideo.attr("data-showcontrols") : "0",
      iframeId = youtubeId + "_sage_" + new Date().getTime(),
      embedUrl = "//www.youtube.com/embed/" + youtubeId + "?start=" + startTime + "&autoplay=" + youtubeAutoPlay + "&rel=" + youtubeRelated + "&controls=" + youtubeShowcontrols + "&showinfo= " + youtubeShowinfo + "&enablejsapi=1",
      iframe = "<iframe class='video-iframe' id='" + iframeId + "' frameborder='0' allowfullscreen='" + youtubeAllowFullScreen + "' src='" + embedUrl + "'></iframe>";
    //add iframe to slide
    targetVideo.append(iframe);
  }

  function playChapter(clickedItem) {
    var seekTime = $(clickedItem).attr("data-video-seek-time"),
      theVideo = $(clickedItem).closest(videoModuleContainerClass).find("." + eventTriggerSelectorClass);

    seekTime = (typeof seekTime === "undefined") ? 0 : seekTime;
    $(clickedItem).closest(".video-chapters-list").find("li").removeClass("playing");
    $(clickedItem).addClass("playing");
    if (!theVideo.hasClass(videoPlayingClass)) {
      playVideo(theVideo, seekTime);
    } else {
      theVideo.find("iframe.video-iframe").each(function () {
        var tmpData = {
          event: "command",
          func: "seekTo",
          args: [seekTime]
        };
        var tmpDataPlay = {
          event: "command",
          func: "playVideo",
          args: []
        };
        $(this)[0].contentWindow.postMessage(JSON.stringify(tmpData), "*");
        $(this)[0].contentWindow.postMessage(JSON.stringify(tmpDataPlay), "*");
      });
    }
  }

  return {
    init: init,
    pauseAllVideos : pauseAllVideos
  }
});