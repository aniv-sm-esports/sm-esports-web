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
exports.ChatMiddleware = void 0;
var Chat_1 = require("../../entity/model/Chat");
var entity_middleware_1 = require("./entity.middleware");
var server_entity_data_1 = require("../../model/server-entity-data");
var page_data_model_1 = require("../../model/page-data.model");
var server_response_model_1 = require("../../model/server-response.model");
var ChatMiddleware = /** @class */ (function (_super) {
    __extends(ChatMiddleware, _super);
    function ChatMiddleware(logger, entityController, routeBase, getRequiresLogon, createRequiresLogon) {
        return _super.call(this, logger, entityController, routeBase, getRequiresLogon, createRequiresLogon) || this;
    }
    ChatMiddleware.prototype.initialize = function () {
        this.cacheServer = this.entityController.chats;
    };
    // Validation
    ChatMiddleware.prototype.validate = function (request, response) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.validateRequest(request, response) &&
                            this.validateCacheDiff(request, response);
                        if (!_a) return [3 /*break*/, 2];
                        return [4 /*yield*/, Promise.resolve(this.validateChatRoom(request, response))];
                    case 1:
                        _a = !!(_b.sent());
                        _b.label = 2;
                    case 2: return [2 /*return*/, _a];
                }
            });
        });
    };
    // Validation -> Request (:chatRoomId)
    ChatMiddleware.prototype.validateRequest = function (request, response) {
        var _a;
        if (!((_a = request.params) === null || _a === void 0 ? void 0 : _a.chatRoomId)) {
            console.log("Chat Room Id not included in URL");
            response.status(500).send(server_response_model_1.ServerEntityResponse.fromError("Chat Room not found."));
            return false;
        }
        return true;
    };
    // Validation -> ChatRoom
    ChatMiddleware.prototype.validateChatRoom = function (request, response) {
        return __awaiter(this, void 0, void 0, function () {
            var chatRoomId;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        chatRoomId = Number((_a = request.params) === null || _a === void 0 ? void 0 : _a.chatRoomId);
                        return [4 /*yield*/, this.entityController.chatRooms.first({
                                Id: chatRoomId
                            })];
                    case 1: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    // Validation -> Default Response
    ChatMiddleware.prototype.respondDefault = function (request, response) {
        this.sendCacheUpdate(request, response);
    };
    // Entity Cache State:  checkState
    ChatMiddleware.prototype.checkState = function (request, response, next) {
        return __awaiter(this, void 0, void 0, function () {
            var chatRoom, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.validateChatRoom(request, response)];
                    case 1:
                        chatRoom = _a.sent();
                        if (!chatRoom) {
                            response.status(500).send(server_response_model_1.ServerEntityResponse.fromError("Chat Room not found."));
                        }
                        else {
                            this.sendCacheUpdate(request, response);
                            next();
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        this.logger.log("Server Error:  Could not post chat");
                        this.logger.log(error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ChatMiddleware.prototype.getState = function (request, response, next) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.checkState(request, response, next)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ChatMiddleware.prototype.setState = function (request, response, next) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.logger.log("Unused Endpoint:  setState");
                next();
                return [2 /*return*/];
            });
        });
    };
    ChatMiddleware.prototype.create = function (request, response, next) {
        return __awaiter(this, void 0, void 0, function () {
            var chatRoom, entity, userJWT, value, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        if (!(request.body.requestData.data.length != 1)) return [3 /*break*/, 1];
                        this.sendInputDataError("Request data must have one entity for creation (only)", request, response);
                        next();
                        return [3 /*break*/, 5];
                    case 1: return [4 /*yield*/, this.validateChatRoom(request, response)];
                    case 2:
                        chatRoom = _a.sent();
                        if (!!chatRoom) return [3 /*break*/, 3];
                        response.status(500).send(server_response_model_1.ServerEntityResponse.fromError("Chat Room not found."));
                        next();
                        return [3 /*break*/, 5];
                    case 3:
                        entity = new Chat_1.Chat();
                        userJWT = response.locals['userJWT'];
                        entity.UserId = userJWT.UserId;
                        entity.Date = new Date();
                        entity.Flagged = false;
                        entity.FlaggedComments = '';
                        entity.Text = request.body.requestData.data[0].Text;
                        return [4 /*yield*/, this.cacheServer.append(entity)];
                    case 4:
                        value = _a.sent();
                        // Success!
                        this.sendSuccessData("Chat added to database successfully!", new server_entity_data_1.ServerEntityData([value], new page_data_model_1.PageData(0, 0)), request, response);
                        next();
                        _a.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_2 = _a.sent();
                        this.logger.log("Server Error:  Could not post chat");
                        this.logger.log(error_2);
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    ChatMiddleware.prototype.get = function (request, response, next) {
        return __awaiter(this, void 0, void 0, function () {
            var chatRoom, chats, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, this.validateChatRoom(request, response)];
                    case 1:
                        chatRoom = _a.sent();
                        if (!!chatRoom) return [3 /*break*/, 2];
                        response.status(500).send(server_response_model_1.ServerEntityResponse.fromError("Chat Room not found."));
                        next();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.cacheServer.getPage(request.body.pageData)];
                    case 3:
                        chats = _a.sent();
                        // Success!
                        this.sendSuccessData("", new server_entity_data_1.ServerEntityData(chats, request.body.pageData), request, response);
                        next();
                        _a.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_3 = _a.sent();
                        this.logger.log("Server Error:  Could not get chats");
                        this.logger.log(error_3);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    ChatMiddleware.prototype.getAll = function (request, response, next) {
        return __awaiter(this, void 0, void 0, function () {
            var chatRoom, chats, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, this.validateChatRoom(request, response)];
                    case 1:
                        chatRoom = _a.sent();
                        if (!!chatRoom) return [3 /*break*/, 2];
                        response.status(500).send(server_response_model_1.ServerEntityResponse.fromError("Chat Room not found."));
                        next();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.cacheServer.getAll()];
                    case 3:
                        chats = _a.sent();
                        // Success!
                        this.sendSuccessData("", new server_entity_data_1.ServerEntityData(chats, request.body.pageData), request, response);
                        next();
                        _a.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_4 = _a.sent();
                        this.logger.log("Server Error:  Could not get chats");
                        this.logger.log(error_4);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    return ChatMiddleware;
}(entity_middleware_1.EntityMiddleware));
exports.ChatMiddleware = ChatMiddleware;
