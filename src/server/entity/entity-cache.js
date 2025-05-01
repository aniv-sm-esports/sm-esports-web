"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityCache = exports.EntityCachePageAvailability = void 0;
var entity_cache_state_1 = require("./entity-cache-state");
var entity_cache_state_data_1 = require("./entity-cache-state-data");
var EntityCachePageAvailability;
(function (EntityCachePageAvailability) {
    EntityCachePageAvailability[EntityCachePageAvailability["Invalid"] = 0] = "Invalid";
    EntityCachePageAvailability[EntityCachePageAvailability["None"] = 1] = "None";
    EntityCachePageAvailability[EntityCachePageAvailability["Partial"] = 2] = "Partial";
    EntityCachePageAvailability[EntityCachePageAvailability["Full"] = 3] = "Full";
})(EntityCachePageAvailability || (exports.EntityCachePageAvailability = EntityCachePageAvailability = {}));
// Design:  This component will serve as a base for either client / server entity transparent caching.
//          Use the protected methods to handle the private cache.
//
var EntityCache = /** @class */ (function () {
    function EntityCache(repositoryKey, entityName, search, isPrimary) {
        this.entities = [];
        this.entityMap = new Map();
        // Initialize State
        this.state = new entity_cache_state_1.EntityCacheState(repositoryKey, entityName, isPrimary, 0, 0, search);
    }
    // Returns a clone of the current state of the repository
    EntityCache.prototype.cloneState = function () {
        return entity_cache_state_data_1.EntityCacheStateData.from(this.state);
    };
    EntityCache.prototype.getInvalid = function () {
        return this.state.getInvalid();
    };
    EntityCache.prototype.getCache = function () {
        if (this.state.getInvalid()) {
            throw new Error("Error:  Trying to use EntityCache in an invalid state ".concat(this.state.getEntityName()));
        }
        return this.entities;
    };
    EntityCache.prototype.getCacheMap = function () {
        if (this.state.getInvalid()) {
            throw new Error("Error:  Trying to use EntityCache in an invalid state ".concat(this.state.getEntityName()));
        }
        return this.entityMap;
    };
    EntityCache.prototype.cacheAppend = function (entity) {
        if (this.state.getInvalid()) {
            throw new Error("Error:  Trying to use EntityCache in an invalid state ".concat(this.state.getEntityName()));
        }
        if (this.entityMap.has(entity.Id)) {
            throw new Error("Error:  Trying to append duplicate entity ".concat(this.state.getEntityName()));
        }
        this.entities.push(entity);
        this.entityMap.set(entity.Id, entity);
    };
    EntityCache.prototype.cacheEvict = function (entity) {
        if (this.state.getInvalid()) {
            throw new Error("Error:  Trying to use EntityCache in an invalid state ".concat(this.state.getEntityName()));
        }
        if (!this.entityMap.has(entity.Id)) {
            throw new Error("Error:  Trying to evice non-existent entity ".concat(this.state.getEntityName()));
        }
        this.entities.filter(function (entity) { return entity.Id !== entity.Id; });
        this.entityMap.delete(entity.Id);
    };
    EntityCache.prototype.cacheClear = function () {
        if (this.state.getInvalid()) {
            throw new Error("Error:  Trying to use EntityCache in an invalid state ".concat(this.state.getEntityName()));
        }
        this.entities.length = 0;
        this.entityMap.clear();
    };
    return EntityCache;
}());
exports.EntityCache = EntityCache;
