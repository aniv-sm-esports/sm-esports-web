"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerMiddleware = void 0;
var LoggerMiddleware = /** @class */ (function () {
    function LoggerMiddleware(logger) {
        this.logger = logger;
    }
    LoggerMiddleware.prototype.logRequest = function (request, response, next) {
        this.logger.log("Server Request:  " + request.url.toString());
        next();
    };
    LoggerMiddleware.prototype.logEntityRequest = function (request, response, next) {
        this.logger.log("Server Request:  " + request.url.toString());
        next();
    };
    return LoggerMiddleware;
}());
exports.LoggerMiddleware = LoggerMiddleware;
