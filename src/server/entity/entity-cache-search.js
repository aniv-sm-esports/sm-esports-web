"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerSearchModelFilter = exports.EntityCacheSearch = void 0;
var lodash_1 = require("lodash");
var rxjs_1 = require("rxjs");
var EntityCacheSearch = /** @class */ (function () {
    function EntityCacheSearch(search, searchFields) {
        var _this = this;
        // Search Filter Changes
        //
        this.searchChangeBehavior = new rxjs_1.BehaviorSubject(this);
        this.searchChange$ = this.searchChangeBehavior.asObservable();
        this.search = search;
        this.searchSettings = new Map();
        searchFields.forEach(function (field) {
            _this.searchSettings.set(field, true);
        });
    }
    EntityCacheSearch.prototype.get = function (key) {
        if (!this.searchSettings.get(key)) {
            console.log("Trying to get search filter for unset field");
            return;
        }
        return lodash_1.default.get(this.search, key);
    };
    EntityCacheSearch.prototype.set = function (key, value) {
        lodash_1.default.set(this.search, key, value);
        this.searchSettings.set(key, true);
        // Notify Observers
        this.searchChangeBehavior.next(this);
    };
    EntityCacheSearch.prototype.has = function (key) {
        return !!this.searchSettings.get(key);
    };
    // Return true if the filter is trivial (no fields will be filtered)
    EntityCacheSearch.prototype.identity = function () {
        return this.searchSettings.size == 0;
    };
    EntityCacheSearch.prototype.clear = function () {
        this.searchSettings.clear();
        // Notify Observers
        this.searchChangeBehavior.next(this);
    };
    // Merges the data for two search models; and returns a new instance. Observables
    // are not included.
    //
    EntityCacheSearch.prototype.merge = function (otherFilter) {
        var filter = Object.assign({}, this.search, otherFilter.search);
        var settings = [];
        // Keep only used settings
        this.searchSettings.forEach(function (setting, key, map) {
            if (setting) {
                settings.push(key);
            }
        });
        otherFilter.searchSettings.forEach(function (setting, key, map) {
            if (setting) {
                settings.push(key);
            }
        });
        return new EntityCacheSearch(filter, settings);
    };
    return EntityCacheSearch;
}());
exports.EntityCacheSearch = EntityCacheSearch;
// TODO: Move this to a global object extension
var ServerSearchModelFilter = /** @class */ (function () {
    function ServerSearchModelFilter() {
    }
    ServerSearchModelFilter.apply = function (entity, filter) {
        var success = true;
        filter.searchSettings.forEach(function (setting, key, map) {
            if (setting) {
                // This particular key must exist
                var theKey = key;
                // Filter Match
                if (entity[theKey] !== filter.search[theKey]) {
                    success = false;
                }
            }
        });
        return success;
    };
    return ServerSearchModelFilter;
}());
exports.ServerSearchModelFilter = ServerSearchModelFilter;
