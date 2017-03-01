/*jslint browser: true*/
/*jslint jquery: true*/
/*global sageApp */

sageApp.modules.register("base", function ($) {
  "use strict";

  var $docScope = $("body");

  function init() {
    initToggleClassEvents();
    initDataHrefEvents();
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

  // initalise any item in the dom with the
  // ('data-href' optional 'data-href-target' (_blank, _self, _parent, _top)used to allow any element to be a link) attribute
  function initDataHrefEvents() {
    $docScope.on("click", "[data-href]", function (e) {
      e.preventDefault();
      var itemHasHref = $(e.target).attr("href") !== undefined,
        itemHref = "",
        itemTarget = "_self";

      //test if clicked item has an href attribute if not use data-href-target
      if (itemHasHref) {
        // set item href to href of target if not blank
        if ($(e.target).attr("href") !== "") {
          itemHref = $(e.target).attr("href");
        }
        // if there is a href target and its not blank set itemTarget
        if ($(e.target).attr("target") !== undefined && $(e.target).attr("target") !== "") {
          itemTarget = $(e.target).attr("target");
        }
      } else {
        // if there is a data-href and it is not blank set itemHref to that value
        if ($(this).attr("data-href") !== undefined && $(this).attr("data-href") !== "") {
          itemHref = $(this).attr("data-href");
        }
        // if there is a data-href-target and its not blank set itemTarget
        if ($(this).attr("data-href-target") !== undefined && $(this).attr("data-href-target") !== "") {
          itemTarget = $(this).attr("data-href-target");
        }
      }

      // Test the target and load the url into the correct container if the item has a non blank href
      if (itemHref !== "") {
        switch (itemTarget) {
          case "_self":
            window.location.href = itemHref;
            break;
          case "_blank":
            window.open(itemHref, "_blank", "location=yes,scrollbars=yes,status=yes");
            break;
          case "_parent":
            window.open(itemHref, "_parent", "location=yes,scrollbars=yes,status=yes");
            break;
          case "_top":
            window.open(itemHref, "_top", "location=yes,scrollbars=yes,status=yes");
            break;
          default:
            window.location.href = itemHref;
        }
      }
    });
  }

  return {
    init: init
  }
});