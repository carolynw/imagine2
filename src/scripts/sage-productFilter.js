/*jslint browser: true*/
/*jslint jquery: true*/
/*global jQuery */
/*global sageApp */

sageApp.modules.register("productFilter", function ($) {
    "use strict";

    var moduleClass = "filter-module-content:not(.partners)",
        filterButtonsClass = "product-filter-icon-wrapper",
        activeClass = "active",
        activeFiltersArray = [],
        productsArray = [],
        sageCompareControl;

    function init() {
        //bind all events to document for delagation to traget product-filter-icon-wrapper
          $(document).on("click", "." + moduleClass + " ." + filterButtonsClass, function (e) {
              e.preventDefault();
              filterIconClicked(e.currentTarget);
          });

          $(document).on("click", "." + moduleClass + " ." + "product-select-icon", function (e) {
              e.preventDefault();
              updateCompare(e.currentTarget);
          });

          setTimeout(initProdSlider, 700);

    }

    function filterIconClicked(clickedItem) {
        var clickedFilter = $(clickedItem).attr("data-filter-attribute");
        if (clickedFilter) {
            $(clickedItem).toggleClass(activeClass);
            updateFilters(clickedFilter);
        }  
    }

    function updateFilters(clickedFilter) {
        var positionInArray = $.inArray(clickedFilter, activeFiltersArray);
        if (positionInArray === -1) {
            activeFiltersArray.push(clickedFilter);
        } else {
            activeFiltersArray.splice(positionInArray, 1);
        }
        updateProducts();
    }

    function updateCompare(clickedItem) {
        $(clickedItem).toggleClass(activeClass);
        $(clickedItem).closest(".product-panel").toggleClass(activeClass);
        $(clickedItem).closest(".panel").next(".icon-select-text").toggleClass(activeClass);
    }


    function drawProducts() {
        var tmpScore = 0,
            recomended = 0,
            mostPopular = 0,
            exaxtMatch = true;
        //Identify product wth highest score and render as recomended 
        console.log(productsArray[0].id + " : " + productsArray[0].score + " - " + productsArray[1].id + " : " + productsArray[1].score + " - " + productsArray[2].id + " : " + productsArray[2].score);
        for (var i = productsArray.length; i--;) {
            if (productsArray[i].score !== Math.round(productsArray[i].score)) {
                mostPopular = i;
            }
            if (productsArray[i].score > tmpScore) {
                tmpScore = productsArray[i].score;
                recomended = i;
            } else if (productsArray[i].score === tmpScore) {
                tmpScore = productsArray[i].score;
                recomended = i;
                exaxtMatch = false; 
            }
        }

        $("." + moduleClass + " .product-panel .panel-pre-heading").html("");
        $("." + moduleClass + " [data-mob-prod-id]").removeClass("most-popular recommended");
        $("." + moduleClass + " [data-desktop-prod-id]").removeClass("most-popular recommended");
        if (tmpScore <= 0.5) {
            $("." + moduleClass + " [data-desktop-prod-id=" + productsArray[mostPopular].id + "]").addClass("most-popular");
            $("." + moduleClass + " [data-mob-prod-id=" + productsArray[mostPopular].id + "]").addClass("most-popular");
            $("." + moduleClass + " .product-panel[data-mob-prod-id=" + productsArray[mostPopular].id + "] .panel-pre-heading").html("Most popular");
        } else {
            $("." + moduleClass + " [data-desktop-prod-id=" + productsArray[recomended].id + "]").addClass("recommended");
            $("." + moduleClass + " [data-mob-prod-id=" + productsArray[recomended].id + "]").addClass("recommended");
            $("." + moduleClass + " .product-panel[data-mob-prod-id=" + productsArray[recomended].id + "] .panel-pre-heading").html("Recommended");
        }

        console.log("mostPopular: " + productsArray[mostPopular].id);
        console.log("recomended:" + productsArray[recomended].id);
        
    }

    function calculateProductScore(tempFeaturesArray) {
        var score = 0;
        //console.log("clicked filter: " + activeFiltersArray);
        //console.log("features: " + tempFeaturesArray);
        //console.log("tmpLength: " + activeFiltersArray.length);
        for (var i = activeFiltersArray.length; i--;) {
            if (tempFeaturesArray.indexOf(activeFiltersArray[i]) !== -1) {
                score++;
            }
        }
        //console.log("score: " + score);
        return score;
    }

    function updateProducts() {
        productsArray = [];
        $("." + moduleClass + " .product-panel").each(function () {
            var tmpFeatures = $(this).attr("data-filter-attributes").split("|");
            productsArray.push(
            {
                "id": $(this).attr("data-mob-prod-id"),
                "score": Number($(this).attr("data-filter-product-score")) + calculateProductScore(tmpFeatures),
                "features": tmpFeatures
            });
        });
        drawProducts();
    }

    function initProdSlider() {
        $(".filter-module-results-list").slick({
          dots: false,
          infinite: false,
          speed: 300,
          slidesToShow: 3,
          slidesToScroll: 1,
          arrows: false,
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
          ]
        });
    }

  return {
    init: init
  }
});