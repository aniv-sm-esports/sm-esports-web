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
exports.EntityCacheServer = void 0;
var entity_cache_1 = require("./entity-cache");
// Design:  Meant as a transparent cache to the database. Currently, the (base) cache
//          is not being used. Hooking it up would be just a matter of checking for a
//          table diff (prepared by postgres triggers), then going off of that during a call.
//
var EntityCacheServer = /** @class */ (function (_super) {
    __extends(EntityCacheServer, _super);
    function EntityCacheServer(adapter, repositoryKey, entityName, search, isPrimary) {
        var _this = _super.call(this, repositoryKey, entityName, search, isPrimary) || this;
        _this.adapter = adapter;
        return _this;
    }
    EntityCacheServer.prototype.getRecordCount = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.adapter.model(this.state.getEntityName()).count()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // Returns true if this repository is out of date
    EntityCacheServer.prototype.getInvalid = function () {
        return this.state.getInvalid();
    };
    EntityCacheServer.prototype.get = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.state.getInvalid()) {
                            throw new Error('Error: Trying to use repository when it is invalid');
                        }
                        return [4 /*yield*/, this.adapter.model(this.state.getEntityName()).findByPk(id, { raw: true })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    EntityCacheServer.prototype.getAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.state.getInvalid()) {
                            throw new Error('Error: Trying to use repository when it is invalid');
                        }
                        return [4 /*yield*/, this.adapter.model(this.state.getEntityName()).findAll({ raw: true })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    EntityCacheServer.prototype.has = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.state.getInvalid()) {
                            throw new Error('Error: Trying to use repository when it is invalid');
                        }
                        return [4 /*yield*/, this.adapter
                                .model(this.state.getEntityName())
                                .findByPk(id, { raw: true })
                                .then(function (response) {
                                return !!response;
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    EntityCacheServer.prototype.forEach = function (callback) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.state.getInvalid()) {
                            throw new Error('Error: Trying to use repository when it is invalid');
                        }
                        return [4 /*yield*/, this.adapter
                                .model(this.state.getEntityName())
                                .findAll({ raw: true })
                                .then(function (response) {
                                response.forEach(function (value, index, array) {
                                    callback(value);
                                });
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    EntityCacheServer.prototype.anyBy = function (callback) {
        return __awaiter(this, void 0, void 0, function () {
            var hasAny;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        hasAny = false;
                        if (this.state.getInvalid()) {
                            throw new Error('Error: Trying to use repository when it is invalid');
                        }
                        return [4 /*yield*/, this.adapter
                                .model(this.state.getEntityName())
                                .findAll({ raw: true })
                                .then(function (response) {
                                response.forEach(function (value, index, array) {
                                    if (callback(value)) {
                                        hasAny = true;
                                        return;
                                    }
                                });
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, hasAny];
                }
            });
        });
    };
    EntityCacheServer.prototype.first = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.state.getInvalid()) {
                            throw new Error('Error: Trying to use repository when it is invalid');
                        }
                        return [4 /*yield*/, this.adapter.model(this.state.getEntityName()).findOne({
                                raw: true,
                                where: options
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    EntityCacheServer.prototype.firstBy = function (callback) {
        return __awaiter(this, void 0, void 0, function () {
            var entity;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.state.getInvalid()) {
                            throw new Error('Error: Trying to use repository when it is invalid');
                        }
                        return [4 /*yield*/, this.adapter
                                .model(this.state.getEntityName())
                                .findAll({ raw: true })
                                .then(function (response) {
                                response.forEach(function (value, index, array) {
                                    if (callback(value)) {
                                        entity = value;
                                        return;
                                    }
                                });
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, entity];
                }
            });
        });
    };
    EntityCacheServer.prototype.whereBy = function (callback) {
        return __awaiter(this, void 0, void 0, function () {
            var entities;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        entities = [];
                        if (this.state.getInvalid()) {
                            throw new Error('Error: Trying to use repository when it is invalid');
                        }
                        // Inefficient use of predicate (not a SQL statement)
                        return [4 /*yield*/, this.adapter
                                .model(this.state.getEntityName())
                                .findAll({ raw: true })
                                .then(function (response) {
                                response.forEach(function (value, index, array) {
                                    if (callback(value)) {
                                        entities.push(value);
                                    }
                                });
                            })];
                    case 1:
                        // Inefficient use of predicate (not a SQL statement)
                        _a.sent();
                        return [2 /*return*/, entities];
                }
            });
        });
    };
    EntityCacheServer.prototype.where = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.adapter.model(this.state.getEntityName()).findAll({
                            raw: true,
                            where: options
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // Returns a page of entities corresponding to the requested page; and validates against
    // the RepositoryState (missing id's + other state information)
    //
    EntityCacheServer.prototype.getPage = function (pageData) {
        return __awaiter(this, void 0, void 0, function () {
            var offset, sql;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.state.getInvalid()) {
                            throw new Error('Error: Trying to use repository when it is invalid');
                        }
                        offset = ((pageData.pageNumber - 1) * pageData.pageSize);
                        sql = 'SELECT * FROM ${this.state.getEntityName()} OFFSET ${offset} LIMIT ${pageData.pageSize}';
                        return [4 /*yield*/, this.adapter.query(sql, { raw: true })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // Returns the page availability based on the (FILTERED) record capacity
    EntityCacheServer.prototype.containsPage = function (pageData) {
        if (this.state.getInvalid()) {
            throw new Error('Error: Trying to use repository when it is invalid');
        }
        var startIndex = (pageData.pageNumber - 1) * pageData.pageSize;
        var endIndex = pageData.pageNumber * pageData.pageSize;
        if (endIndex <= startIndex ||
            endIndex < 0 ||
            startIndex < 0) {
            return entity_cache_1.EntityCachePageAvailability.Invalid;
        }
        if (this.state.getFilteredRecordCapacity() - 1 < startIndex)
            return entity_cache_1.EntityCachePageAvailability.None;
        else if (this.state.getFilteredRecordCapacity() - 1 < endIndex) {
            return entity_cache_1.EntityCachePageAvailability.Partial;
        }
        else
            return entity_cache_1.EntityCachePageAvailability.Full;
    };
    // Creates a fully-initialized child repository (with whatever data is currently available)
    EntityCacheServer.prototype.createChild = function (additionalFilter) {
        if (this.state.getInvalid()) {
            console.log("Error: Trying to create child repository when it is invalid (".concat(this.state.getKey(), ")"));
            return this;
        }
        // Child Repository (use special merge to gather search settings properly)
        var mergedFilter = this.state.getFilter().merge(additionalFilter);
        // Create repository with both filters applied
        return new EntityCacheServer(this.adapter, this.state.getKey(), this.state.getEntityName(), mergedFilter, false);
    };
    // Calls append over the provided collection
    EntityCacheServer.prototype.appendMany = function (entities) {
        var _this = this;
        if (!this.state.getIsPrimary()) {
            console.log("Error: Trying to append to non-primary repository! (".concat(this.state.getKey(), ")"));
            return;
        }
        if (this.state.getInvalid()) {
            console.log("Error: Trying to use repository when it is invalid (".concat(this.state.getKey(), ")"));
            return;
        }
        if (!this.state.getFilter().identity()) {
            console.log("Error: Trying to append (from DB) to repository that has a filter (".concat(this.state.getKey(), ")"));
            return;
        }
        return new Promise(function (resolve, reject) {
            var result = [];
            entities.forEach(function (entity) { return __awaiter(_this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, ((_a = this.append(entity)) === null || _a === void 0 ? void 0 : _a.then(function (model) {
                                result.push(model);
                            }).catch(function (reject) {
                                reject(reject);
                            }))];
                        case 1:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            resolve(result);
        });
    };
    // Appends new record, and does NOT INVALIDATE the repository. This is used during
    // initialization; or after the search filter is set. FILTER APPLIED!
    EntityCacheServer.prototype.append = function (entity) {
        if (!this.state.getIsPrimary()) {
            console.log("Error: Trying to append to non-primary repository! (".concat(this.state.getKey(), ")"));
            return;
        }
        if (this.state.getInvalid()) {
            console.log("Error: Trying to use repository when it is invalid (".concat(this.state.getKey(), ")"));
            return;
        }
        if (!this.state.getFilter().identity()) {
            console.log("Error: Trying to append (from DB) to repository that has a filter (".concat(this.state.getKey(), ")"));
            return;
        }
        // TYPE ISSUES! Some functions of Model<,> aren't implemented in class derivatives. This is making it
        //              annoying to use this ORM.
        //
        var thing = {};
        Object.getOwnPropertyNames(entity).forEach(function (key) {
            // This particular key must exist
            var theKey = key;
            thing[key] = entity[theKey];
        });
        return this.adapter.model(this.state.getEntityName()).build(thing).save();
    };
    // Removes entity from the database using a SINGLE transaction. Dependencies must be accounted-for by previous
    // removals.
    EntityCacheServer.prototype.remove = function (entity) {
        if (!this.state.getIsPrimary()) {
            console.log("Error: Trying to remove from non-primary repository! (".concat(this.state.getKey(), ")"));
            return;
        }
        if (this.state.getInvalid()) {
            console.log("Error: Trying to use repository when it is invalid (".concat(this.state.getKey(), ")"));
            return;
        }
        return this.adapter.model(this.state.getEntityName()).destroy({
            where: {
                Id: entity.Id
            }
        });
    };
    return EntityCacheServer;
}(entity_cache_1.EntityCache));
exports.EntityCacheServer = EntityCacheServer;
