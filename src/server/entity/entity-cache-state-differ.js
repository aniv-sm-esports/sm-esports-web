"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityCacheStateDiffer = void 0;
var lodash_1 = require("lodash");
var moment_1 = require("moment");
var EntityCacheStateDiffer = /** @class */ (function () {
    function EntityCacheStateDiffer() {
    }
    // TODO: Get package component or use decorators for DTO classes
    //
    EntityCacheStateDiffer.objectDiff = function (object1, object2) {
        // CRITICAL*** Type is deceptive! The object prototype will show differences! So, most
        //             well written diff tools will catch them; and we just need property or
        //             field comparison! (Actually, just fields.. with eventual decorators!)
        //
        var result = false;
        // NOTE***     Similar code to the search model filter
        Object.getOwnPropertyNames(object1).forEach(function (key) {
            // This particular key must exist
            var theKey = key;
            // Q:  Does the theKey exist for another inheritance path for object2?
            // Filter Match:  Using lodash on just the properties. These may be nested; but for
            //                our DTO's, we still have shallow properties. Date was not compared
            //                properly (still).
            if (!lodash_1.default.isEqual(object1[theKey], object2[theKey])) {
                result = true;
                console.log("DIFF FIELD:  " + theKey.toString());
                console.log("OBJECT 1:    " + String(object1[theKey]));
                console.log("OBJECT 2:    " + String(object2[theKey]));
                console.log("MOMENT 1:    " + (0, moment_1.default)(String(object1[theKey])));
                console.log("MOMENT 2:    " + (0, moment_1.default)(String(object2[theKey])));
            }
        });
        return result;
    };
    // Diffs two filters - aware of JSON serialization incompleteness.
    EntityCacheStateDiffer.filterDiff = function (filter, otherFilter) {
        var mapDiffers = false;
        filter.searchSettings.forEach(function (value, key, map) {
            if (!otherFilter.searchSettings.has(key))
                mapDiffers = true;
            else {
                mapDiffers = mapDiffers || (value !== otherFilter.searchSettings.get(key));
            }
        });
        return this.objectDiff(filter.search, otherFilter.search) || mapDiffers;
    };
    // Diffs two filters - aware of JSON serialization incompleteness.
    EntityCacheStateDiffer.filterDataDiff = function (filterSearch, filterSearchSettings, otherFilterSearch, otherFilterSearchSettings) {
        var mapDiffers = false;
        filterSearchSettings.forEach(function (value, key, map) {
            if (!otherFilterSearchSettings.some(function (x) { return x === value; }))
                mapDiffers = true;
        });
        // TEMPORARY DIFF ROUTINE:  Going to work on JSON serialization + type decorators + type diff (based on
        //                          decorators). There should be a normal solution using TypeDI / typestack, or
        //                          maybe any of the other libraries that seem complete. Angular should even have
        //                          a solution shared with node.
        //
        return this.objectDiff(filterSearch, otherFilterSearch) || mapDiffers;
    };
    // Returns true if repository states differ; and must be matched before updating
    // data.
    EntityCacheStateDiffer.stateDiff = function (state, otherState) {
        return state.getKey() !== otherState.getKey() ||
            state.getEntityName() !== otherState.getEntityName() ||
            state.getUnFilteredRecordCapacity() !== otherState.getUnFilteredRecordCapacity() ||
            state.getFilteredRecordCapacity() !== otherState.getUnFilteredRecordCapacity() ||
            EntityCacheStateDiffer.filterDiff(state.getFilter(), otherState.getFilter());
    };
    // Returns true if repository states differ; and must be matched before updating
    // data.
    EntityCacheStateDiffer.stateDataDiff = function (serverState, clientState) {
        return serverState.repositoryKey !== clientState.repositoryKey ||
            serverState.entityName !== clientState.entityName ||
            serverState.unfilteredRecordCapacity !== clientState.unfilteredRecordCapacity ||
            serverState.filteredRecordCapacity !== clientState.filteredRecordCapacity ||
            EntityCacheStateDiffer.filterDataDiff(serverState.filterSearch, serverState.filterSearchSettings, clientState.filterSearch, clientState.filterSearchSettings);
    };
    return EntityCacheStateDiffer;
}());
exports.EntityCacheStateDiffer = EntityCacheStateDiffer;
