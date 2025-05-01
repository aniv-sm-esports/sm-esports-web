"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserCreation = void 0;
var UserCreation = /** @class */ (function () {
    function UserCreation() {
        this.userName = '';
        this.email = '';
        this.password = '';
        this.userNameInvalid = false;
        this.emailInvalid = false;
        this.passwordInvalid = false;
        this.userNameValidationMessage = '';
        this.emailValidationMessage = '';
        this.passwordValidationMessage = '';
    }
    UserCreation.prototype.update = function (userCreation) {
        Object.assign(this, userCreation);
    };
    UserCreation.default = function () {
        return new UserCreation();
    };
    return UserCreation;
}());
exports.UserCreation = UserCreation;
