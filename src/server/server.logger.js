"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerLogger = exports.ServerLoggerSettings = exports.ServerEnvironment = void 0;
var entity_cache_state_differ_1 = require("./entity/entity-cache-state-differ");
var moment_1 = require("moment/moment");
var styleText = require('node:util').styleText;
var ServerEnvironment;
(function (ServerEnvironment) {
    ServerEnvironment[ServerEnvironment["DEV"] = 0] = "DEV";
    ServerEnvironment[ServerEnvironment["TEST"] = 1] = "TEST";
    ServerEnvironment[ServerEnvironment["PROD"] = 2] = "PROD";
})(ServerEnvironment || (exports.ServerEnvironment = ServerEnvironment = {}));
var ServerLoggerSettings = /** @class */ (function () {
    function ServerLoggerSettings(environment, errorColor, warningColor, infoColor, prependDate, specialInfoColor, specialSuccessColor, specialWarningColor, specialErrorColor) {
        this.errorColor = errorColor;
        this.warningColor = warningColor;
        this.infoColor = infoColor;
        this.environment = environment;
        this.prependDate = prependDate;
        this.specialInfoColor = specialInfoColor;
        this.specialSuccessColor = specialSuccessColor;
        this.specialWarningColor = specialWarningColor;
        this.specialErrorColor = specialErrorColor;
    }
    return ServerLoggerSettings;
}());
exports.ServerLoggerSettings = ServerLoggerSettings;
var ServerLogger = /** @class */ (function () {
    // For color strings, see node:util "styleText"
    function ServerLogger(settings) {
        this.settings = settings;
    }
    // Normal logging
    ServerLogger.prototype.logError = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        console.log.apply(console, __spreadArray([styleText([this.settings.errorColor], this.formatMessage(message))], args, false));
    };
    ServerLogger.prototype.logWarning = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        console.log.apply(console, __spreadArray([styleText([this.settings.warningColor], this.formatMessage(message))], args, false));
    };
    ServerLogger.prototype.logInfo = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        console.log.apply(console, __spreadArray([styleText([this.settings.infoColor], this.formatMessage(message))], args, false));
    };
    ServerLogger.prototype.log = function (data) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        console.log.apply(console, __spreadArray([styleText([this.settings.infoColor], this.formatMessage(JSON.stringify(data)))], args, false));
    };
    // Special case logging
    ServerLogger.prototype.logSpecialError = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        console.log.apply(console, __spreadArray([styleText([this.settings.specialErrorColor], this.formatMessage(message))], args, false));
    };
    ServerLogger.prototype.logSpecialWarning = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        console.log.apply(console, __spreadArray([styleText([this.settings.specialWarningColor], this.formatMessage(message))], args, false));
    };
    ServerLogger.prototype.logSpecialSuccess = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        console.log.apply(console, __spreadArray([styleText([this.settings.specialSuccessColor], this.formatMessage(message))], args, false));
    };
    ServerLogger.prototype.logSpecial = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        console.log.apply(console, __spreadArray([styleText([this.settings.specialInfoColor], this.formatMessage(message))], args, false));
    };
    // Logs difference of entity cache states (client v.s. server per entity request
    //
    ServerLogger.prototype.logStateDiff = function (clientState, serverState) {
        var serverStateString = this.stateToString(serverState);
        var clientStateString = this.stateToString(clientState);
        var diff = entity_cache_state_differ_1.EntityCacheStateDiffer.stateDataDiff(clientState, serverState);
        this.logSpecial("Server State:  " + serverStateString);
        this.logSpecial("Client State:  " + clientStateString);
        if (diff) {
            this.logSpecialError("Diff State:  (Failed)");
        }
        else {
            this.logSpecialSuccess("Diff State:  (Success)");
        }
    };
    ServerLogger.prototype.formatMessage = function (message) {
        return this.settings.prependDate ? (0, moment_1.default)().format('YYYY-MM-DD hh:mm:ss:SSSS') + "  " + message : message;
    };
    // TODO: FINISH TYPE DECORATORS / SERIALIZATION (Problem adding functions to DTO's)
    ServerLogger.prototype.stateToString = function (state) {
        return "((".concat(state.repositoryKey, "), (").concat(state.entityName, "), (").concat(state.filterSearchSettings, "), (").concat(state.filteredRecordCapacity, "), (").concat(state.unfilteredRecordCapacity, "), INVAILD(").concat(state.invalid, "))");
    };
    return ServerLogger;
}());
exports.ServerLogger = ServerLogger;
