import {RepositoryState} from './repository-state.model';
import {RepositoryEntity} from './repository-entity';
import {PageData} from '../service/page.model';
import {SearchModel} from '../service/search.model';
import moment, {Moment} from 'moment';
import * as crypto from 'node:crypto';
import {Predicate} from '../service/handler.model';

export enum RepositoryPageAvailability {
  Invalid = 0,
  None = 1,
  Partial = 2,
  Full = 3
}

export class Repository<T extends RepositoryEntity> {

  private readonly entities:Array<T> = new Array<T>();
  private readonly entityMap:Map<number, T> = new Map();

  private state:RepositoryState<T>;
  private name:string;
  private initialized:boolean;
  private propertyNames:string[];

  constructor(name:string) {
    this.state = new RepositoryState<T>(0,SearchModel.default<T>());
    this.name = name;
    this.initialized = false;
    this.propertyNames =[];
  }

  public static default<T extends RepositoryEntity>():Repository<T> {
    return new Repository('');
  }

  // Creates a fully-initialized child repository (with whatever data is currently available)
  createChild(additionalFilters:SearchModel<T>) {

    if (!this.initialized) {
      console.log(`Error: Trying to utilize repository before it is initialized (${this.name})`);
      return Repository.default();
    }

    // Additional Filters
    let filters = Object.assign({}, this.state.filter, additionalFilters);

    // Child Repository
    let repository = new Repository<T>(this.name);

    // Empty Initialize
    repository.emptyInitialize(new RepositoryState<T>(this.state.recordCapacity, filters));

    // Load the repository with all filters applied
    this.entities.forEach(entity => {
      if (repository.doesFilterPass(entity)) {
        repository.append(entity);
      }
    });

    // Set as ready
    repository.initialized = true;

    return repository;
  }

  getFingerprint() {

    // Date
    let result:string = this.state.lastRepositoryChange.toString();

    // Filters
    result = result + this.state.filter.searchMap.toString();

    // TODO: Extend global Object
    return crypto
      .createHash("sha256")
      .update(result, "utf8")
      .digest("hex" as crypto.BinaryToTextEncoding);
  }

  // Initializes the repository with no-data; but the full set of config data, including filters.
  //
  emptyInitialize(state:RepositoryState<T>) {
    this.state = state;
    this.entities.length = 0;   // CLEAR ALL (BAD! NEED BETTER PROTOTYPE!)
    this.entityMap.clear();
    this.initialized = true;

    console.log(`Repository initialized:  ${this.name}`);
  }

  // Initialize the repository with all records (server-side)
  fullInitialize(unfiltered:Array<T>, filter:SearchModel<T>) {

    // Set filters
    this.state.filter = filter;

    let filtered = unfiltered.filter((item, index, array) => {
      return this.doesFilterPass(item);
    });

    // Load Entities
    filtered.forEach(item => {
      this.entities.push(item);
      this.entityMap.set(item.id, item);
    });

    // Set rest of state
    this.state.recordCapacity = filtered.length;
    this.state.lastRepositoryChange = moment();
    this.initialized = true;

    console.log(`Repository initialized:  ${this.name}`);
  }

  getSize() {
    return this.state.recordCapacity;
  }

  // Returns the availability of the repository for the requested page (given its last update)
  contains(pageData:PageData) {

    if (!this.initialized) {
      console.log(`Error: Trying to utilize repository before it is initialized (${this.name})`);
      return;
    }

    let startIndex = (pageData.pageNumber - 1) * pageData.pageSize;
    let endIndex = pageData.pageNumber * pageData.pageSize;

    if (endIndex <= startIndex ||
        endIndex < 0 ||
        startIndex < 0) {
      return RepositoryPageAvailability.Invalid;
    }

    if (this.entities.length - 1 < startIndex)
      return RepositoryPageAvailability.None;

    else if (this.entities.length - 1 < endIndex) {
      return RepositoryPageAvailability.Partial;
    }
    else
      return RepositoryPageAvailability.Full;
  }

  get(id:number) {

    if (!this.initialized) {
      console.log(`Error: Trying to utilize repository before it is initialized (${this.name})`);
      return;
    }

    return this.entityMap.get(id);
  }

  getFirst(search:SearchModel<T>) {
    let filtered = this.entities.filter((item:T) => {
      return this.doesFilterPass(item);
    });

    if (filtered.length > 0) {
      return filtered[0];
    }

    return undefined;
  }
  getUnique(search:SearchModel<T>) {

    let filtered = this.entities.filter((item:T) => {
      return this.doesFilterPass(item);
    });

    if (filtered.length !== 1){
      console.log(`Error: Found multiple values of entity:  (${this.name}).getUnique`);
      return undefined;
    }

    return filtered[0];
  }

  // Use only for small amounts of data! These are already filtered!
  getAll() {
    return this.entities;
  }

  getLastChange() {
    return this.state.lastRepositoryChange;
  }

  has(id:number) {
    if (!this.initialized) {
      console.log(`Error: Trying to utilize repository before it is initialized (${this.name})`);
      return;
    }

    return this.entityMap.has(id);
  }

  any(callback:Predicate<T>) {
    return this.entities.some((item:T) => callback(item));
  }

  first(callback:Predicate<T>) {
    let filtered = this.entities.filter((item:T) => callback(item));

    if (filtered.length > 0) {
      return filtered[0];
    }
    else
      return undefined;
  }

  // FILTERED: Sets existing entity
  set(entity:T) {

    if (!this.initialized) {
      console.log(`Error: Trying to utilize repository before it is initialized (${this.name})`);
      return;
    }

    if (!this.doesFilterPass(entity)) {
      console.log(`Error: Trying to set entity that does not pass repository filters:  (${this.name})`);
      return;
    }

    if (this.entityMap.has(entity.id)) {
        let existing = this.entityMap.get(entity.id)!;
        let index = this.entities.indexOf(existing);

        this.entityMap.set(entity.id,entity);
        this.entities[index] = entity;

        // INVALIDATE
        this.state.lastRepositoryChange = moment();
    }
    else {
      console.log(`Error: Trying to set non-existing entity (by :id):  (${this.name})`);
    }
  }

  // FILTERED: Appends new entity to the set. Checks for existing.
  append(entity:T) {
    if (!this.initialized) {
      console.log(`Error: Trying to utilize repository before it is initialized (${this.name})`);
      return;
    }

    if (!this.doesFilterPass(entity)) {
      console.log(`Error: Trying to set entity that does not pass repository filters:  (${this.name})`);
      return;
    }

    if (!this.entityMap.has(entity.id)) {

      this.entityMap.set(entity.id,entity);
      this.entities.push(entity);

      // INVALIDATE: Also resize the repository!
      this.state.lastRepositoryChange = moment();
      this.state.recordCapacity++;
    }
    else {
      console.log(`Error: Trying to set overwrite existing entity (by :id):  (${this.name})`);
    }
  }

  // Returns a page of entities corresponding to the requested page; and validates against
  // the RepositoryState (missing id's + other state information)
  //
  getPage(pageData:PageData) {

    let result:Array<T> = [];

    if (!this.initialized) {
      console.log(`Error: Trying to utilize repository before it is initialized (${this.name})`);
      return;
    }

    if (this.contains(pageData) === RepositoryPageAvailability.None ||
      this.contains(pageData) === RepositoryPageAvailability.Invalid) {
      console.log(`Error: Page data is not available in repository. Please query the server for update:  ${this.name}`);
      return;
    }

    let startIndex = (pageData.pageNumber - 1) * pageData.pageSize;
    let endIndex = pageData.pageNumber * pageData.pageSize;

    // Fulfill Request (may be partial)
    //
    for (let index= startIndex; (index < endIndex) && (index < this.entities.length); index++) {
        result.push(this.entities[index]);
    }

    return result;
  }

  // Updates Repository from page data from another repository (usually server -> client)
  update(entities:Array<T>, pageData:PageData, lastRepositoryChange:Moment) {

    if (!this.initialized) {
      console.log(`Repository refresh required:  ${this.name}`);
      return;
    }

    if (this.state.lastRepositoryChange !== lastRepositoryChange) {
      this.initialized = false;
      console.log(`Repository change detected (must first refresh). Un-Initializing:  ${this.name}`);
      return;
    }

    let recordsAdded = 0;

    // Map the result
    for (let index = 0; index < entities.length; index++) {

      // Match by the required :id
      let existing = this.entities.find(item => item.id);

      if (!existing) {
        this.entities.push(entities[index]);
        this.entityMap.set(entities[index].id, entities[index]);
        recordsAdded++;
      }
      else {
        Object.assign(existing, entities[index]); // References both entity collections!
      }
    }

    console.log(`Repository records added:  ${recordsAdded}`);
  }

  private doesFilterPass(entity:T) {

    let success = true;

    // Cache property names for performance
    if (this.propertyNames.length == 0) {
      Object.getOwnPropertyNames(entity).forEach(propertyName => {

        // Just choose properties that have a value
        let theKey = propertyName as keyof typeof entity;

        // Property Search Defined  // TODO: Serialization not working for the functions. Probably need interface (?)
        if (!!this.state.filter.searchMap[propertyName]) {
          this.propertyNames.push(propertyName);
        }
      });
    }

    // Property Filter
    this.propertyNames.forEach(key => {

      // This particular key must exist
      let theKey = key as keyof typeof entity;

      // Regex
      let regex = new RegExp(this.state.filter.searchMap[key]);

      // Filter Match
      if (!String(entity[theKey]).match(regex)) {
        success = false;
      }
    });

    return success;
  }
}
