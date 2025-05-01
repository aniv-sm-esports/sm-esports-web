"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserJWTClientDTO = void 0;
var UserJWTClientDTO = /** @class */ (function () {
    function UserJWTClientDTO(userName, loginTime, expirationTime) {
        this.userName = '';
        this.loginTime = new Date();
        this.expirationTime = new Date();
        this.userName = userName;
        this.loginTime = loginTime;
        this.expirationTime = expirationTime;
    }
    return UserJWTClientDTO;
}());
exports.UserJWTClientDTO = UserJWTClientDTO;
