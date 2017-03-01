/*jslint browser: true*/
/*jslint jquery: true*/

(function (window) {
  "use strict";

  var sageApp = window.sageApp = (window.sageApp ? window.sageApp : {});
  var $ = window.jQuery;

  sageApp.init = function () {
    sageApp.modules.activateAll();
  };

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
      $.each(registeredModules, function (name, module) {
        var bootstrapped = module($);

        try {
          if (typeof bootstrapped.init === "function")
            bootstrapped.init();

          activeModules[name] = bootstrapped;
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

  sageApp.logger = (function () {
    function logInfo(message) {
      console.log(message);
      // todo: remote logging
    }

    function logWarn(message) {
      console.warn(message);
      // todo: remote logging
    }

    function logError(message) {
      console.error(message);
      // todo: remote logging
    }

    return {
      logInfo: logInfo,
      logWarn: logWarn,
      logError: logError
    }
  }());
}(window));