"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityCacheStateData = void 0;
// Class for data transport for RepositoryState<T>
var EntityCacheStateData = /** @class */ (function () {
    function EntityCacheStateData() {
        this.repositoryKey = '';
        this.entityName = '';
        this.isPrimary = false;
        this.filterSearchSettings = [];
        this.filterSearch = {};
        this.filteredRecordCapacity = 0;
        this.unfilteredRecordCapacity = 0;
        this.invalid = false;
    }
    EntityCacheStateData.from = function (state) {
        var result = new EntityCacheStateData();
        result.entityName = state.getEntityName();
        result.repositoryKey = state.getKey();
        result.isPrimary = state.getIsPrimary();
        result.filterSearchSettings = Array.from(state.getFilter().searchSettings.keys());
        result.filterSearch = state.getFilter().search;
        result.filteredRecordCapacity = state.getFilteredRecordCapacity();
        result.unfilteredRecordCapacity = state.getFilteredRecordCapacity();
        result.invalid = state.getInvalid();
        return result;
    };
    return EntityCacheStateData;
}());
exports.EntityCacheStateData = EntityCacheStateData;
