/*jslint browser: true*/
/*jslint jquery: true*/
/*global sageApp */

sageApp.modules.register("base", function ($) {
  "use strict";

  var $docScope = $("body");

  function init() {
    initToggleClassEvents();
  }

  // initalise any item in the dom with the
  // ('data-toggleCssClass' required list of classes to update, space separated) attribute
  // ('data-toggleCssTarget' required list of target ids to update, jquery selector)
  function initToggleClassEvents() {
    var toggleCssTrigger = "data-toggleCssClass",
      toggleCssTarget = "data-toggleCssTarget";

    $docScope.on("click", "[" + toggleCssTrigger + "]", function (e) {
      e.preventDefault();
      var theSourceItem = $(this),
        rawClasses = theSourceItem.attr(toggleCssTrigger),
        rawIDs = theSourceItem.attr(toggleCssTarget);

      //return if either is empty
      if (rawClasses === "" || rawIDs === "") return;

      //use jquery to toggle classes.
      $(rawIDs).toggleClass(rawClasses);
    });
    $docScope.on("click", "[data-toggle='collapse'][data-sage-parent]", function (e) {
      var id = $(e.currentTarget).attr("data-sage-parent");
      $docScope.find(id).collapse('toggle');
    });
  }

  return {
    init: init
  }
});