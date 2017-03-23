/*jslint browser: true*/
/*jslint jquery: true*/
/*global sageApp */

sageApp.modules.register("form", function ($) {
    "use strict";

    function init() {
        if ($("form[data-wffm]").length) {


            var allNonRadioInputs = $("form[data-wffm] .form-group input:not([type=radio])");
            var dropdowns = $("form[data-wffm] .form-group select");
            allNonRadioInputs.each(function () {
                $(this)
                    .focusin(function () {
                        var label = $(this).prev("label.control-label");
                        if (label) {
                            $(this).addClass("onFocus");
                            label.addClass("onFocus");
                        }
                    });
                $(this)
                    .focusout(function () {
                        var label = $(this).prev("label.control-label");
                        if (label) {
                            $(this).removeClass("onFocus");
                            label.removeClass("onFocus");
                        }

                    });
            });
            dropdowns.each(function () {
                $(this)
                    .focusin(function () {
                        var label = $(this).prev("label.control-label");
                        if (label) {
                            $(this).addClass("onFocus");
                            label.addClass("onFocus");
                        }

                    });
                $(this)
                    .focusout(function () {
                        var label = $(this).prev("label.control-label");
                        if (label) {
                            $(this).removeClass("onFocus");
                            label.removeClass("onFocus");
                        }

                    });
            });
        } else {
            if (!$(".request-form").length)
                return;
            var allNonRadioInputsFE = $(".request-form .form-group input:not([type=radio])");
            var dropdownsFE = $(".request-form .form-group select");
            allNonRadioInputsFE.each(function () {
                $(this).focusout(function () {
                    var val = $(this).val();
                    if (val) {
                        $(this).addClass("filled");
                    } else {
                        $(this).removeClass("filled");
                    }
                });
            });
            dropdownsFE.each(function () {
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
    }

    return {
        init: init
    };
});