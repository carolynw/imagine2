/*jslint browser: true*/
/*jslint jquery: true*/
/*global sageApp */

sageApp.modules.register("solutions", function ($) {
    "use strict";

    var triggerItem = ".widget-placeholder-inner.solution",
        activeClass = "active",
        inactiveClass = "inactive";

    function init() {
        /*bind solution click events*/
        $(document).on("click", triggerItem, function (e) {
            e.preventDefault();
            solutionClicked(e.currentTarget);
        });
        $(document).on("click", ".solution-trig.active", function (e) {
            e.preventDefault();
            removeActive();
        });

        initSlick();
    }

    function initSlick() {
        $(".solution-filter").slick({
            dots: true,
            infinite: false,
            speed: 300,
            slidesToShow: 4,
            centerMode: false,
            variableWdith: false,
            slidesToScroll: 4,
            responsive: [
                {
                    breakpoint: 960,
                    settings: {
                        focusOnSelect: false,
                        centerMode: false,
                        slidesToShow: 3,
                        slidesToScroll: 3,
                        initialSlide: 1,
                        centerPadding: "40px",
                        dots: true,
                        arrows: false
                    }
                },
                {
                    breakpoint: 720,
                    settings: {
                        focusOnSelect: false,
                        centerMode: false,
                        slidesToShow: 2,
                        slidesToScroll: 2,
                        initialSlide: 1,
                        centerPadding: "40px",
                        dots: true,
                        arrows: false
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        focusOnSelect: true,
                        centerMode: false,
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        initialSlide: 1,
                        centerPadding: "40px",
                        dots: true,
                        arrows: false
                    }
                }
            ]
        });
    }

    function removeActive() {
        $(".solution-trig").removeClass("active").removeClass("inactive");
    }

    function solutionClicked(clickedItem) {
        var isActive = $(clickedItem).closest("div.border-top-bottom").hasClass(activeClass);

        if (isActive) {
            $(triggerItem).each(function () {
                $(this).closest("div.border-top-bottom").removeClass(inactiveClass).removeClass(activeClass);
            });
        } else {
            $(triggerItem).each(function () {
                $(this).closest("div.border-top-bottom").addClass(inactiveClass).removeClass(activeClass);
            });
            $(clickedItem).closest("div.border-top-bottom").removeClass(inactiveClass).addClass(activeClass);
        }
    }

    return {
        init: init
    };
});