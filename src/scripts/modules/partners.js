/*jslint browser: true*/
/*jslint jquery: true*/
/*global jQuery */
/*global sageApp */

sageApp.modules.register("partners",
    function ($) {
        "use strict";

        var topics = {};

        $.Topic = function (id) {
            var callbacks,
                topic = id && topics[id];

            if (!topic) {
                callbacks = $.Callbacks();
                topic = {
                    publish: callbacks.fire,
                    subscribe: callbacks.add,
                    unsubscribe: callbacks.remove
                };

                if (id) {
                    topics[id] = topic;
                }
            }
            return topic;
        };

        function init() {
            initPartnerSlider();
            initPartnersClickPublishers();
        }

        function initPartnersClickPublishers() {
            $("[data-case-study-filter]").click(function () {
                $.Topic("case-study-filter").publish($(this).data("case-study-filter"));
            });
        }

        function initPartnerSlider() {
            $(".partner-filter").slick({
                dots: true,
                infinite: false,
                speed: 300,
                slidesToShow: 5,
                centerMode: false,
                variableWdith: false,
                slidesToScroll: 5,
                responsive: [
                    {
                        breakpoint: 960,
                        settings: {
                            focusOnSelect: false,
                            centerMode: false,
                            slidesToShow: 3,
                            slidesToScroll: 3,
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