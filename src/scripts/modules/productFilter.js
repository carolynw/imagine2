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
        filteredProductArray = [],
        mostPopularOriginal = "";

    function init() {
        //bind all events to document for delagation to traget product-filter-icon-wrapper
          $(document).on("click", "." + moduleClass + " ." + filterButtonsClass, function (e) {
              e.preventDefault();
              filterIconClicked(e.currentTarget);
          });

          $(document).on("click", "." + moduleClass + " ." + "product-select-icon", function (e) {
              e.preventDefault();
              updateCompare();
          });

          initProdSlider();
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

    function updateCompare() {
        $("." + moduleClass + " .product-panel").toggleClass(activeClass);
        $("." + moduleClass + " .product-panel").find(".icon-select-text, .product-select-icon").toggleClass(activeClass);
    }

    function drawProducts() {
        var tmpScore = filteredProductArray[0].score,
            recomended = filteredProductArray[0].id,
            mostPopular = mostPopularOriginal,
            exaxtMatch = true;
        
        //find most popular product from class most-popular
        for (var i = productsArray.length; i--;) {
            if (productsArray[i].mostPopular) {
                if (mostPopular === "") {
                    mostPopular = productsArray[i].id;
                    mostPopularOriginal = mostPopular;
                }
            }
        }

        //if no most popular default to first product
        if (mostPopular === "") {
            mostPopular = productsArray[0].id;
        }

        //remove most popular and recomended product classes
        $("." + moduleClass + " .product-panel .panel-pre-heading").html("");
        $("." + moduleClass + " [data-mob-prod-id]").removeClass("most-popular recommended");
        $("." + moduleClass + " [data-desktop-prod-id]").removeClass("most-popular recommended");

        //add most popular and recomended product classes as appropriate
        if (tmpScore < 1) {
            $("." + moduleClass + " [data-desktop-prod-id=" + mostPopular + "]").addClass("most-popular");
            $("." + moduleClass + " [data-mob-prod-id=" + mostPopular + "]").addClass("most-popular");
            $("." + moduleClass + " .product-panel[data-mob-prod-id=" + mostPopular + "] .panel-pre-heading").html("Most popular");
        } else {
            $("." + moduleClass + " [data-desktop-prod-id=" + recomended + "]").addClass("recommended");
            $("." + moduleClass + " [data-mob-prod-id=" + recomended + "]").addClass("recommended");
            $("." + moduleClass + " .product-panel[data-mob-prod-id=" + recomended + "] .panel-pre-heading").html("Recommended");
            //if on mobile put the recommended on focus 
            var index = $("." + moduleClass + " .product-panel[data-mob-prod-id=" + recomended + "]").attr("data-slick-index");
            $(".filter-module-results-list").slick("slickGoTo",index);
        }
        
    }

    function calculateProductScore(tempFeaturesArray) {
        var score = 0;
        for (var i = activeFiltersArray.length; i--;) {
            if (tempFeaturesArray.indexOf(activeFiltersArray[i]) !== -1) {
                score++;
            }
        }
        return score;
    }

    function updateProducts() {
        productsArray = [];
        filteredProductArray = [];

        //push products into productsArray with calculated scores
        $("." + moduleClass + " .product-panel").each(function () {
            var tmpFeatures = $(this).attr("data-filter-attributes").split("|"),
                tmpScore =  calculateProductScore(tmpFeatures);
            productsArray.push(
            {
                "id": $(this).attr("data-mob-prod-id"),
                "score": tmpScore,
                "price": $(this).attr("data-price"),
                "mostPopular": $(this).hasClass("most-popular"),
                "features": tmpFeatures
            });
        });

        //sorts products in productsArray with highest scores first
        productsArray.sort(function (a, b) {
            return b.score - a.score;
        });
        
        //push high scored products with the same score into filteredProductsArray
        var tmpHighScore = productsArray[0].score;
        filteredProductArray.push(productsArray[0]);
        for (var i = 1; i <= productsArray.length-1; i++) {
            if (productsArray[i].score === tmpHighScore) {
                filteredProductArray.push(productsArray[i]);
            } else {
                break;
            }
        }
        
        //sorts products in filteredProductsArray with lowest price first if more than one
        if (filteredProductArray.length > 1) {
            filteredProductArray.sort(function (a, b) {
                return a.price - b.price;
            });
        }

        drawProducts();
    }

    function initProdSlider() {
        $(".filter-module-results-list")
            .slick({
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
                    centerPadding: "20px",
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
  };
});