/*jslint browser: true*/
/*jslint jquery: true*/

(function () {
    "use strict";

    var sageApp = window.sageApp = (window.sageApp ? window.sageApp : {});
    var $ = window.$;

    sageApp.modules = (function () {
        var registeredModules = {};
        var activeModules = {};

        function register(name, bootStrapper) {
            name = $.trim(name);

            if (registeredModules[name] !== void 0)
                throw "Module with name '" + name + "' already registered";

            registeredModules[name] = bootStrapper;
        }

        function unRegister(name) {
            delete registeredModules[name];
        }

        function activateAll() {
            // Create all modules in turn
            $.each(registeredModules, function (name, bootStrapper) {
                try {
                    activeModules[name] = bootStrapper($) || {};
                } catch (error) {
                    sageApp.logger.logError(error);
                }
            });

            // Now execute each module's init function. This happens after all bootstrapping is complete in order to allow for
            // module inter-dependencies to work without worrying about load ordering.
            $.each(activeModules, function (name, moduleFuncs) {
                try {
                    if (moduleFuncs && typeof moduleFuncs.init === "function") {
                        moduleFuncs.init();
                    }
                } catch (error) {
                    sageApp.logger.logError(error);
                }
            });
        }

        return {
            register: register,
            unRegister: unRegister,
            registered: registeredModules,
            activateAll: activateAll,
            active: activeModules
        }
    }());
}());