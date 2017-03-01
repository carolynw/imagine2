/*jslint browser: true*/
/*jslint jquery: true*/
/*global sageApp */

sageApp.modules.register("ux2Nav", function ($) {
  "use strict";

  function init() {
    var $body = $("body");
    var $sideNav = $("#ux2_side_nav");

    $body.on("click", "[data-sidenav='open']", function(event){
      event.preventDefault();
      $body.addClass("no-scroll");
      $sideNav.addClass("open");
    });

    $body.on("click", "[data-sidenav='close']", function(event){
      event.preventDefault();
      $body.removeClass("no-scroll");
      $sideNav.removeClass("open");
    });

    $sideNav.on("click", ".section-header", function(event){
      event.preventDefault();
      $(this).closest(".section").toggleClass("open");
    })
  }

  return {
    init: init
  }
});