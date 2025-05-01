"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserCredentialClientDTO = void 0;
var UserCredentialClientDTO = /** @class */ (function () {
    function UserCredentialClientDTO() {
        this.userName = "";
        this.password = "";
    }
    UserCredentialClientDTO.fromLogon = function (userName, password) {
        var result = new UserCredentialClientDTO();
        result.userName = userName;
        result.password = password;
        return result;
    };
    return UserCredentialClientDTO;
}());
exports.UserCredentialClientDTO = UserCredentialClientDTO;
