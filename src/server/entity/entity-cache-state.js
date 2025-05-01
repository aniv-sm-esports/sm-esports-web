"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityCacheState = void 0;
var entity_cache_search_1 = require("./entity-cache-search");
var entity_cache_state_differ_1 = require("./entity-cache-state-differ");
var EntityCacheState = /** @class */ (function () {
    function EntityCacheState(repositoryKey, entityName, isPrimary, filteredRecordCapacity, unfilteredRecordCapacity, filter) {
        this.repositoryKey = repositoryKey;
        this.entityName = entityName;
        this.isPrimary = isPrimary;
        this.filteredRecordCapacity = filteredRecordCapacity;
        this.unfilteredRecordCapacity = unfilteredRecordCapacity;
        this.filter = filter;
        this.invalid = false;
        // Problem with initialization of subscription - initial firing invalidated
        // the state! So, this subscription will keep a weak (?) reference to the
        // input filter "filter" on this stack.
        this.filter.searchChange$.subscribe(function (searchChange) {
            //this.invalid = this.filter.differs(filter);
        });
    }
    EntityCacheState.prototype.getKey = function () { return this.repositoryKey; };
    EntityCacheState.prototype.getEntityName = function () { return this.entityName; };
    EntityCacheState.prototype.getIsPrimary = function () { return this.isPrimary; };
    EntityCacheState.prototype.getInvalid = function () { return this.invalid; };
    EntityCacheState.prototype.getFilteredRecordCapacity = function () { return this.filteredRecordCapacity; };
    EntityCacheState.prototype.getUnFilteredRecordCapacity = function () { return this.unfilteredRecordCapacity; };
    EntityCacheState.prototype.getFilter = function () { return this.filter; };
    EntityCacheState.from = function (data) {
        return new EntityCacheState(data.repositoryKey, data.entityName, data.isPrimary, data.filteredRecordCapacity, data.unfilteredRecordCapacity, new entity_cache_search_1.EntityCacheSearch(data.filterSearch, data.filterSearchSettings));
    };
    // Used by primary repository to update record count
    EntityCacheState.prototype.primaryAppend = function (recordsAdded, invalidate) {
        if (!this.isPrimary) {
            console.log("Error: Trying to update non-primary repository:  ".concat(this.repositoryKey));
            return;
        }
        // TODO!
        this.filteredRecordCapacity += recordsAdded;
        this.unfilteredRecordCapacity += recordsAdded;
        this.invalid = this.invalid || invalidate;
    };
    // Sets the state of (this) repository to the parent repository. This would be
    // done during a refresh of the repository, or during initialization.
    //
    EntityCacheState.prototype.set = function (parentState) {
        if (parentState.entityName !== this.entityName ||
            parentState.repositoryKey !== this.repositoryKey) {
            console.log("Error:  Entity Name / Repository Keys don't match:  ParentKey(".concat(parentState.repositoryKey, "), ParentEntity(").concat(parentState.entityName, "), ChildKey(").concat(this.repositoryKey, "), ChildEntity(").concat(this.entityName, ")"));
            return;
        }
        var changed = entity_cache_state_differ_1.EntityCacheStateDiffer.filterDiff(this.filter, parentState.filter);
        this.entityName = parentState.entityName;
        this.repositoryKey = parentState.repositoryKey;
        // Don't want to erase observables
        this.filter.search = parentState.filter.search;
        this.filter.searchSettings = parentState.filter.searchSettings;
        // -> Notify()
        if (changed) {
            this.filter.searchChangeBehavior.next(this.filter);
        }
        // -> Must Initialize! The state has been modified. After initializing, there
        //                     should be a client-initiated get for record pages or entities.
        this.invalid = parentState.invalid;
        this.unfilteredRecordCapacity = parentState.unfilteredRecordCapacity;
        this.filteredRecordCapacity = parentState.filteredRecordCapacity;
    };
    return EntityCacheState;
}());
exports.EntityCacheState = EntityCacheState;
