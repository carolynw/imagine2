/*jslint browser: true*/
/*jslint jquery: true*/
/*global sageApp */

sageApp.modules.register("articles", function ($) {
    "use strict";

    function init() {
        initSlick();
    }

    function initSlick() {
        $(".article-list").slick({
            dots: true,
            infinite: false,
            speed: 300,
            slidesToShow: 4,
            slidesToScroll: 4,
            arrows: false,
            variableWidth: false,
            responsive: [
                {
                    breakpoint: 769,
                    settings: {
                        focusOnSelect: false,
                        arrows: false,
                        centerMode: false,
                        slidesToShow: 2,
                        slidesToScroll: 2,
                        initialSlide: 1,
                        dots: true
                    }
                },
                {
                    breakpoint: 375,
                    settings: {
                        focusOnSelect: false,
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

    return {
        init: init
    };
});