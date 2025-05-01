"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityMiddleware = exports.HttpMethod = void 0;
var entity_cache_state_differ_1 = require("../../entity/entity-cache-state-differ");
var server_response_model_1 = require("../../model/server-response.model");
var HttpMethod;
(function (HttpMethod) {
    HttpMethod["GET"] = "GET";
    HttpMethod["POST"] = "POST";
})(HttpMethod || (exports.HttpMethod = HttpMethod = {}));
var EntityMiddleware = /** @class */ (function () {
    function EntityMiddleware(logger, entityController, routeBase, getRequiresLogon, createRequiresLogon) {
        this.logger = logger;
        this.entityController = entityController;
        this.routeBase = routeBase;
        this.getRequiresLogon = getRequiresLogon;
        this.createRequiresLogon = createRequiresLogon;
    }
    EntityMiddleware.prototype.send = function (statusCode, message, serverData, responseType, request, response) {
        var serverState = this.cacheServer.cloneState();
        var diff = entity_cache_state_differ_1.EntityCacheStateDiffer.stateDataDiff(serverState, request.body.cacheState);
        var diffResult = diff ? server_response_model_1.ServerCacheDiffResult.ClientInvalid : server_response_model_1.ServerCacheDiffResult.Synchronized;
        response.status(statusCode).send(new server_response_model_1.ServerEntityResponse(this.cacheServer.cloneState(), diffResult, serverData, responseType, message));
    };
    // Default response for cache state update
    EntityMiddleware.prototype.sendCacheUpdate = function (request, response) {
        this.send(200, '', request.body.requestData, server_response_model_1.ServerResponseType.Success, request, response);
    };
    // Sends data input error to client
    EntityMiddleware.prototype.sendInputDataError = function (message, request, response) {
        this.send(401, '', request.body.requestData, server_response_model_1.ServerResponseType.InputDataError, request, response);
    };
    // Sends data input error to client
    EntityMiddleware.prototype.sendSuccess = function (message, request, response) {
        this.send(200, message, request.body.requestData, server_response_model_1.ServerResponseType.Success, request, response);
    };
    // Sends data input error to client
    EntityMiddleware.prototype.sendSuccessData = function (message, data, request, response) {
        this.send(200, message, data, server_response_model_1.ServerResponseType.Success, request, response);
    };
    // Validates the cache state data before running a request (run with validate())
    EntityMiddleware.prototype.validateCacheDiff = function (request, response) {
        var serverState = this.cacheServer.cloneState();
        return entity_cache_state_differ_1.EntityCacheStateDiffer.stateDataDiff(serverState, request.body.cacheState);
    };
    return EntityMiddleware;
}());
exports.EntityMiddleware = EntityMiddleware;
