// Slightly modified version of the Aura.js logger which works in Node or the Browser.
module.exports = (function () {
    'use strict';

    // Declare dependencies
    // ----------------------------------------------
    var cons = require('isomorphic-console'); // this way we get either console.log or sys.print


    // Declare vars
    // ----------------------------------------------
    var noop = function () {},
        console = cons || {};

    // Begin Module
    // ----------------------------------------------
    // https://github.com/aurajs/aura/blob/master/lib/logger.js
    function Logger(name) {
        this.name = name;
        this._log = noop;
        this._warn = noop;
        this._error = noop;
        this._enabled = false;
        return this;
    }

    Logger.prototype.isEnabled = function () {
        return this._enabled;
    };

    Logger.prototype.setName = function (name) {
        this.name = name;
    };

    Logger.prototype.enable = function () {
        var logFns = ["log", "warn", "error"],
            i;

        this._log = console.log || noop;
        this._warn = console.warn || this._log;
        this._error = console.error || this._log;
        this._enabled = true;

        try {
            if (!(Function.prototype.bind && typeof console === "object")) {
                return;
            }

            for (i = 0; i < logFns.length; i++) {
                console[logFns[i]] = Function.prototype.call.bind(console[logFns[i]], console);
            }

        } catch (e) {}

        return this;
    };

    Logger.prototype.write = function (output, args) {
        var parameters = Array.prototype.slice.call(args);
        parameters.unshift(this.name + ":");
        output.apply(console, parameters);
    };

    Logger.prototype.log = function () {
        this.write(this._log, arguments);
    };

    Logger.prototype.warn = function () {
        this.write(this._warn, arguments);
    };

    Logger.prototype.error = function () {
        this.write(this._error, arguments);
    };

    return Logger;
}());
