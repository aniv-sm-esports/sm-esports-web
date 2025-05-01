"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerEntityResponse = exports.ServerResponse = exports.ServerCacheDiffResult = exports.ServerResponseType = void 0;
var server_entity_data_1 = require("./server-entity-data");
var ServerResponseType;
(function (ServerResponseType) {
    ServerResponseType["None"] = "None";
    ServerResponseType["Success"] = "Success";
    ServerResponseType["LogonRequired"] = "Logon Required";
    ServerResponseType["PermissionRequired"] = "Permission Required";
    ServerResponseType["InputDataError"] = "Input Data Error";
    ServerResponseType["ServerError"] = "Server Error";
})(ServerResponseType || (exports.ServerResponseType = ServerResponseType = {}));
var ServerCacheDiffResult;
(function (ServerCacheDiffResult) {
    ServerCacheDiffResult["Synchronized"] = "Synchronized";
    ServerCacheDiffResult["ClientInvalid"] = "Client Invalid";
})(ServerCacheDiffResult || (exports.ServerCacheDiffResult = ServerCacheDiffResult = {}));
var ServerResponse = /** @class */ (function () {
    function ServerResponse(responseData, response, message) {
        this.responseData = responseData;
        this.response = response;
        this.message = message;
    }
    ServerResponse.fromData = function (data) {
        return new ServerResponse(new server_entity_data_1.ServerData([data]), ServerResponseType.Success, "");
    };
    ServerResponse.fromError = function (message) {
        return new ServerResponse(server_entity_data_1.ServerData.default(), ServerResponseType.ServerError, message);
    };
    ServerResponse.fromDataError = function (message) {
        return new ServerResponse(server_entity_data_1.ServerData.default(), ServerResponseType.InputDataError, message);
    };
    return ServerResponse;
}());
exports.ServerResponse = ServerResponse;
var ServerEntityResponse = /** @class */ (function (_super) {
    __extends(ServerEntityResponse, _super);
    function ServerEntityResponse(cacheState, diffResult, responseData, response, message) {
        var _this = _super.call(this, responseData, response, message) || this;
        _this.cacheState = cacheState;
        _this.diffResult = diffResult;
        return _this;
    }
    return ServerEntityResponse;
}(ServerResponse));
exports.ServerEntityResponse = ServerEntityResponse;
