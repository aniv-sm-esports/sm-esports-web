"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
var server_application_1 = require("../server.application");
var UserJWT_1 = require("../entity/model/UserJWT");
var User_1 = require("../entity/model/User");
var UserCredential_1 = require("../entity/model/UserCredential");
var server_response_model_1 = require("../model/server-response.model");
var AuthMiddleware = /** @class */ (function () {
    function AuthMiddleware(entityController, authService, serverLogger) {
        this.entityController = entityController;
        this.authService = authService;
        this.serverLogger = serverLogger;
    }
    // PROBLEM WITH TYPE STRUCTURING:  See server.definitions.ts. The type inheritance doesn't find template inheritance
    //                                 AFAIK (can tell). So, the ServerExpressEntityRequest !(extends) ServerExpressRequest.
    //                                 We need this polymorphic pattern to work (!!) >_<.  So, there are (unfortunately), two
    //                                 paths for our middleware, since there is only a little code to deal with.
    // BYPASS FOR DEVELOPMENT:  Next problem is to implement the JWKS server
    AuthMiddleware.prototype.authenticate = function (request, response, next) {
        return __awaiter(this, void 0, void 0, function () {
            var token, verified, userJWT, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // INITIALIZE LOCALS! (These are available for this request pipe)
                        response.locals = new server_application_1.ServerLocals();
                        response.locals['userJWT'] = undefined;
                        response.locals['userJWTValid'] = false;
                        // NOTE*****  The "Bearer undefined" value should not be hard coded, here. The middle ware is having
                        //            problems somewhere in jwt.verify; and it is swallowing exceptions.
                        if (!request.headers.authorization ||
                            request.headers.authorization == 'Bearer undefined') {
                            return [2 /*return*/, next()];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        token = request.headers.authorization.replace('Bearer ', '');
                        return [4 /*yield*/, Promise.resolve(this.authService.verify(token))];
                    case 2:
                        verified = _a.sent();
                        return [4 /*yield*/, Promise.resolve(this.authService.getUserSession(token))];
                    case 3:
                        userJWT = _a.sent();
                        if (verified && !!userJWT) {
                            response.locals['userJWT'] = userJWT;
                            response.locals['userJWTValid'] = verified;
                            this.serverLogger.log("User Verified " + userJWT.User.Name);
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        this.serverLogger.logError('Server Request Error: Could not verify user from auth headers (usually this means the JWT token has expired)');
                        this.serverLogger.logError(error_1);
                        return [3 /*break*/, 5];
                    case 5:
                        next();
                        return [2 /*return*/];
                }
            });
        });
    };
    AuthMiddleware.prototype.getSession = function (request, response, next) {
        return __awaiter(this, void 0, void 0, function () {
            var userJWT;
            return __generator(this, function (_a) {
                try {
                    userJWT = response.locals["userJWT"];
                    // Logged On
                    if (userJWT && userJWT !== UserJWT_1.UserJWT.default()) {
                        response.status(200).send(server_response_model_1.ServerResponse.fromData(userJWT));
                    }
                    // Not Logged On (TODO: Update Status Codes for proper client behavior)
                    else {
                        response.status(200).send(server_response_model_1.ServerResponse.fromData(UserJWT_1.UserJWT.default()));
                    }
                }
                catch (error) {
                    this.serverLogger.logError(error);
                }
                return [2 /*return*/];
            });
        });
    };
    AuthMiddleware.prototype.logon = function (request, response, next) {
        return __awaiter(this, void 0, void 0, function () {
            var userJWT, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Validate User Data:  TODO: Fix the data input to fix the use of just the array
                        if (!request.body.requestData.data[0].userName ||
                            request.body.requestData.data[0].userName.trim() == '' ||
                            !request.body.requestData.data[0].password ||
                            request.body.requestData.data[0].password.trim() == '') {
                            response.status(401).send();
                            return [2 /*return*/];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.authService.logon(request.body.requestData.data[0])];
                    case 2:
                        userJWT = _a.sent();
                        response.status(200).send(server_response_model_1.ServerResponse.fromData(userJWT));
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        console.log(error_2);
                        response.status(500).send(server_response_model_1.ServerResponse.fromError("Error logging on. Please verify user name / password"));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AuthMiddleware.prototype.logoff = function (request, response, next) {
    };
    AuthMiddleware.prototype.create = function (request, response, next) {
        return __awaiter(this, void 0, void 0, function () {
            var creation_1, success, emailMatcher, passwordMatcher1, passwordMatcher2, passwordMatcher3, passwordMatcher4, existingUser, user, error_3;
            var _this = this;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        creation_1 = request.body.requestData.data[0];
                        // Reset Validation
                        //
                        creation_1.userNameInvalid = false;
                        creation_1.emailInvalid = false;
                        creation_1.passwordInvalid = false;
                        creation_1.userNameValidationMessage = '';
                        creation_1.emailValidationMessage = '';
                        creation_1.passwordValidationMessage = '';
                        success = true;
                        // UserName
                        if (!creation_1.userName) {
                            creation_1.userNameInvalid = true;
                            creation_1.userNameValidationMessage = "User name is required";
                            success = false;
                        }
                        else if (creation_1.userName.includes(" ")) {
                            creation_1.userNameInvalid = true;
                            creation_1.userNameValidationMessage = "User name must not contain white space(s)";
                            success = false;
                        }
                        else if (!creation_1.userName.match(/^[a-zA-Z0-9_]+$/)) {
                            creation_1.userNameInvalid = true;
                            creation_1.userNameValidationMessage = "User name must be alphanumeric";
                            success = false;
                        }
                        else if (creation_1.userName.length < 8 || creation_1.userName.length > 15) {
                            creation_1.userNameInvalid = true;
                            creation_1.userNameValidationMessage = "User name must be between 8 and 15 characters";
                            success = false;
                        }
                        emailMatcher = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
                        if (!creation_1.email) {
                            creation_1.emailInvalid = true;
                            creation_1.emailValidationMessage = "Email is required";
                            success = false;
                        }
                        else if (creation_1.email.includes(" ")) {
                            creation_1.emailInvalid = true;
                            creation_1.emailValidationMessage = "Email cannot contain white space(s)";
                            success = false;
                        }
                        else if (!creation_1.email.match(emailMatcher)) {
                            creation_1.emailInvalid = true;
                            creation_1.emailValidationMessage = "Email is invalid";
                            success = false;
                        }
                        passwordMatcher1 = /^(?=.*[A-Z])/;
                        passwordMatcher2 = /^(?=.*[!@#$&*])/;
                        passwordMatcher3 = /^(?=.*[0-9])/;
                        passwordMatcher4 = /^(?=.*[a-z]).{8}/;
                        if (!creation_1.password) {
                            creation_1.passwordInvalid = true;
                            creation_1.passwordValidationMessage = "Password is required";
                            success = false;
                        }
                        else if (creation_1.password.includes(" ")) {
                            creation_1.passwordInvalid = true;
                            creation_1.passwordValidationMessage = "Password cannot contain white space(s)";
                            success = false;
                        }
                        else if (!creation_1.password.match(passwordMatcher1)) {
                            creation_1.passwordInvalid = true;
                            creation_1.passwordValidationMessage = "Password must contain one upper case character";
                            success = false;
                        }
                        else if (!creation_1.password.match(passwordMatcher2)) {
                            creation_1.passwordInvalid = true;
                            creation_1.passwordValidationMessage = "Password must contain one special character";
                            success = false;
                        }
                        else if (!creation_1.password.match(passwordMatcher3)) {
                            creation_1.passwordInvalid = true;
                            creation_1.passwordValidationMessage = "Password must contain one number";
                            success = false;
                        }
                        else if (!creation_1.password.match(passwordMatcher4)) {
                            creation_1.passwordInvalid = true;
                            creation_1.passwordValidationMessage = "Password must contain one lower case character";
                            success = false;
                        }
                        else if (creation_1.password.length < 8 || creation_1.password.length > 20) {
                            creation_1.passwordInvalid = true;
                            creation_1.passwordValidationMessage = "Password must be between 8 and 20 characters";
                            success = false;
                        }
                        // Validation Failed
                        if (!success) {
                            response.status(400).send(server_response_model_1.ServerResponse.fromDataError("There was a validation error. Please check your credentials."));
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.entityController.users.first({ Name: creation_1.userName })];
                    case 1:
                        existingUser = _b.sent();
                        if (!!existingUser) {
                            response.status(400).send(server_response_model_1.ServerResponse.fromDataError('User already exists - Please try a different user name'));
                            return [2 /*return*/];
                        }
                        user = new User_1.User();
                        user.Name = creation_1.userName;
                        user.Email = creation_1.email;
                        user.CreatedDate = new Date();
                        user.UserRoleId = 0;
                        user.PictureUrl = "";
                        user.PersonRoleId = 0;
                        user.EmailVisible = true;
                        user.LongDescription = "";
                        user.ShortDescription = "";
                        return [4 /*yield*/, ((_a = this.entityController.users.append(user)) === null || _a === void 0 ? void 0 : _a.then(function (value) { return __awaiter(_this, void 0, void 0, function () {
                                var userCredential, newCredential;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            userCredential = new UserCredential_1.UserCredential();
                                            userCredential.User = value;
                                            userCredential.Password = creation_1.password;
                                            userCredential.UserId = value.Id;
                                            return [4 /*yield*/, this.entityController.userCredentials.append(userCredential)];
                                        case 1:
                                            newCredential = _a.sent();
                                            // Success
                                            response.status(200).send(server_response_model_1.ServerResponse.fromData(creation_1));
                                            return [2 /*return*/];
                                    }
                                });
                            }); }, function (err) {
                                _this.serverLogger.logError(err);
                                response.status(500).send(server_response_model_1.ServerResponse.fromDataError(err));
                            }))];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_3 = _b.sent();
                        this.serverLogger.logError(error_3);
                        response.status(500).send(server_response_model_1.ServerResponse.fromError('An Error has occurred: See server log for details'));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return AuthMiddleware;
}());
exports.AuthMiddleware = AuthMiddleware;
