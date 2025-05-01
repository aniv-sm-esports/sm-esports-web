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
exports.AuthService = void 0;
var moment_1 = require("moment/moment");
var crypto_js_1 = require("crypto-js");
var node_fs_1 = require("node:fs");
var UserJWT_1 = require("../entity/model/UserJWT");
var UserJWTClientDTO_1 = require("../../app/model/client-dto/UserJWTClientDTO");
var AuthService = /** @class */ (function () {
    function AuthService(entityController, serverLogger) {
        this.entityController = entityController;
        this.serverLogger = serverLogger;
        this.PUBLIC_KEY = node_fs_1.default.readFileSync('public.key', 'utf-8');
    }
    // Signs User Credentials:  Creates JWT bearer token information using express-jwt
    //
    AuthService.prototype.logon = function (credentials) {
        var _this = this;
        // Validation
        if (!credentials.password || credentials.password.trim() == '' ||
            !credentials.userName || credentials.userName.trim() == '') {
            return Promise.reject("User name / password are required");
        }
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                // -> User
                this.getUser(credentials.userName.trim())
                    .then(function (user) {
                    // -> UserCredential
                    _this.getUserCredentials(credentials.userName.trim())
                        .then(function (userCredential) {
                        // VALIDATE USER:  Password
                        if (credentials.password != userCredential.Password) {
                            reject("Invalid Password");
                        }
                        else {
                            // -> User Session
                            _this.getUserJWT(user.Id).then(function (userJWTCredential) {
                                // Expired Token!
                                if ((0, moment_1.default)().isBefore((0, moment_1.default)(userJWTCredential.ExpirationTime))) {
                                    // -> Evict Token
                                    _this.evictSession(userJWTCredential).then(function (success) {
                                        if (!success) {
                                            reject("Error evicting user session. Logon Failed!");
                                        }
                                        else {
                                            // -> New Session
                                            _this.createSession(userCredential).then(function (session) {
                                                // Resolve (New Session Created)
                                                resolve(session);
                                            }, function (message) {
                                                reject(message);
                                            });
                                        }
                                    }, function (message) {
                                        reject(message);
                                    });
                                }
                                // Valid Session! Resolve!
                                else {
                                    resolve(userJWTCredential);
                                }
                                // -> Not Found (UserJWT)
                            }, function (message) {
                                // (No Session Found) -> New Session
                                _this.createSession(userCredential).then(function (session) {
                                    // Resolve! (New Session Created)
                                    resolve(session);
                                }, function (message) {
                                    reject(message);
                                });
                            });
                        }
                        // -> Not Found (UserCredential)
                    }, function (message) {
                        reject(message);
                    });
                    // -> Not Found (User)
                }, function (message) {
                    reject(message);
                }).catch(function (error) {
                    // ERROR:  Log -> Reject
                    _this.serverLogger.logError("LOGON ERROR:  See server log for details");
                    _this.serverLogger.logError(error);
                    reject(error);
                });
                return [2 /*return*/];
            });
        }); });
    };
    // Removes User Session
    AuthService.prototype.logoff = function (token) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.getUserSession(token).then(function (entity) {
                var _a;
                if (entity) {
                    (_a = _this.entityController.userJWTs.remove(entity)) === null || _a === void 0 ? void 0 : _a.then(function (result) {
                        resolve(result === 1);
                    }, function (message) {
                        reject(message);
                    });
                }
            }, function (message) {
                reject(message);
            });
        });
    };
    // Verifies:  1) User session exists for the given token; 2) That the session has not expired
    AuthService.prototype.verify = function (token) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.getUserSession(token).then(function (session) {
                if (session) {
                    resolve((0, moment_1.default)().isAfter((0, moment_1.default)(session.ExpirationTime)));
                }
                else {
                    reject("User session not found");
                }
            }, function (message) {
                reject(message);
            });
        });
    };
    AuthService.prototype.getUserSession = function (token) {
        var _this = this;
        return this.entityController.userJWTs.where({
            Token: token
        }).then(function (value) {
            var sessions = value;
            if (sessions.length != 1)
                return undefined;
            else {
                return sessions[0];
            }
        }).catch(function (error) {
            _this.serverLogger.logError("Authentication Error:  See server log for details");
            _this.serverLogger.logError(error);
            return undefined;
        });
    };
    // Creates new session token for valid user / user credentials
    AuthService.prototype.createSession = function (userCredential) {
        var _this = this;
        // Create payload to store user name and logon time (+ 120 minutes)
        //
        var expiration = (0, moment_1.default)().add(120, 'minutes').toDate();
        var payload = new UserJWTClientDTO_1.UserJWTClientDTO(userCredential.User.Name, new Date(), expiration);
        // Encrypt JWT Payload
        //
        var token = crypto_js_1.default.AES.encrypt(JSON.stringify(payload), this.PUBLIC_KEY).toString();
        // Store JWT Session Info
        //
        var newJWT = new UserJWT_1.UserJWT();
        newJWT.UserId = userCredential.UserId;
        newJWT.Token = token;
        newJWT.ExpirationTime = expiration;
        newJWT.LoginTime = new Date();
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, ((_a = this.entityController
                            .userJWTs
                            .append(newJWT)) === null || _a === void 0 ? void 0 : _a.then(function (value) {
                            resolve(value);
                        }, function (message) {
                            reject(message);
                        }).catch(function (error) {
                            reject(error);
                        }))];
                    case 1:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    };
    // Removes the user session from the database
    AuthService.prototype.evictSession = function (session) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var _a;
            (_a = _this.entityController
                .userJWTs
                .remove(session)) === null || _a === void 0 ? void 0 : _a.then(function (removed) {
                resolve(removed === 1);
            });
        });
    };
    // Returns promise for getting user from the database
    AuthService.prototype.getUser = function (userName) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.entityController
                .users
                .firstBy(function (x) { return x.Name === userName; })
                .then(function (user) {
                if (!user) {
                    reject("Authentication Failed:  User not found");
                }
                else {
                    resolve(user);
                }
            });
        });
    };
    // Returns promise for getting user credential from the database
    AuthService.prototype.getUserCredentials = function (userName) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.entityController
                .userCredentials
                .firstBy(function (x) { return x.User.Name === userName; }).then(function (credentials) {
                if (!credentials) {
                    reject("Authentication Failed:  User Credentials not found");
                }
                else {
                    resolve(credentials);
                }
            });
        });
    };
    // Returns promise for getting session from the database
    AuthService.prototype.getUserJWT = function (userId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.entityController
                .userJWTs
                .firstBy(function (x) { return x.UserId === userId; }).then(function (session) {
                if (!session) {
                    reject("User session not found");
                }
                else {
                    resolve(session);
                }
            });
        });
    };
    return AuthService;
}());
exports.AuthService = AuthService;
