/*jslint browser: true*/
/*jslint jquery: true*/
/*global sageApp */

sageApp.modules.register("swapper",
    function ($) {
        "use strict";

        function init() {
            configureSwappers();
            configureFilterableSwappers();
        }

        function configureSwappers() {
            $("body").on("swap", "[data-swapper]", beginSwap);
        }

        function configureFilterableSwappers() {
            $("[data-swapper][data-swapper-filter]").each(function () {
                var $this = $(this);

                $.Topic($this.data("swapper-filter")).subscribe(function (id) {
                    var event = $.Event("swap");
                    event.payload = {Filters: [id]};
                    $this.trigger(event);
                });
            });
        }

        function beginSwap(event) {
            var baseUrl = event.baseUrl || $(this).data("swapper");

            $.ajax({
                method: "POST",
                url: baseUrl,
                data: JSON.stringify({Data: event.payload}),
                context: this,
                contentType: "application/json; charset=utf-8"
            }).done(doSwap);
        }

        function doSwap(data) {
            $(this).html(data.Data);
        }

        return {
            init: init
        };
    });