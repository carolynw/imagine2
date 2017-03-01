/*jslint browser: true*/
/*jslint jquery: true*/
/*global sageApp */

sageApp.modules.register("form", function ($) {
  "use strict";

  function init() {
    focusHelper();

    if (!$(".request-form").length)
      return;

    var allNonRadioInputs = $(".request-form .form-group input:not([type=radio])");
    var dropdowns = $(".request-form .form-group select");
    allNonRadioInputs.each(function () {
      $(this).focusout(function () {
        var val = $(this).val();
        if (val) {
          $(this).addClass("filled");
        } else {
          $(this).removeClass("filled");
        }
      });
    });
    dropdowns.each(function () {
      $(this).focusout(function () {
        var val = $(this).val();
        if (val) {
          $(this).addClass("filled");
        } else {
          $(this).removeClass("filled");
        }
      });
    });
  }

  function focusHelper(){
    $("form").on("focus", "input", function(){
      $(this).closest("label").addClass("focus-within");
    });

    $("form").on("blur", "input", function(){
      $(this).closest("label").removeClass("focus-within");
    });
  }

  return {
    init: init
  }
});