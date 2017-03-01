/*jslint browser: true*/
/*jslint jquery: true*/
/*global sageApp */

sageApp.modules.register("accounting", function ($) {
  "use strict";

  function init() {
    if (!$("#phone_fan").length)
      return;

    var controller = new ScrollMagic.Controller();
    var scene = new ScrollMagic.Scene({
      triggerElement: '#phone_fan_trigger'//, // starting scene, when reaching this element
    }).setClassToggle("#phone_fan, .accounting-module", "open");

    // Add Scene to ScrollMagic Controller
    controller.addScene(scene);
  }

  return {
    init: init
  }
});