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
exports.ServerEntityData = exports.ServerData = void 0;
var ServerData = /** @class */ (function () {
    function ServerData(data) {
        this.data = [];
        this.data = data;
    }
    ServerData.default = function () {
        return new ServerData([]);
    };
    return ServerData;
}());
exports.ServerData = ServerData;
var ServerEntityData = /** @class */ (function (_super) {
    __extends(ServerEntityData, _super);
    function ServerEntityData(data, pageData) {
        var _this = _super.call(this, data) || this;
        _this.pageData = pageData;
        return _this;
    }
    return ServerEntityData;
}(ServerData));
exports.ServerEntityData = ServerEntityData;
