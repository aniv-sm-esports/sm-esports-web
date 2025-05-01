import { EntityCache, EntityCachePageAvailability} from './entity-cache';
import {EntityCacheSearch} from './entity-cache-search';
import {Sequelize} from 'sequelize-typescript';
import {Entity} from './model/Entity';
import {EntityCacheStateData} from './entity-cache-state-data';
import {Callback, Predicate} from '../../app/model/service/handler.model';
import {WhereOptions} from 'sequelize';
import {PageData} from '../model/page-data.model';

export interface IMapType extends Omit<any, string> {
  [key: string]: any;
}

// Design:  Meant as a transparent cache to the database. Currently, the (base) cache
//          is not being used. Hooking it up would be just a matter of checking for a
//          table diff (prepared by postgres triggers), then going off of that during a call.
//
export class EntityCacheServer<T extends Entity<T>> extends EntityCache<T> {

  private readonly adapter:Sequelize;

  constructor(adapter: Sequelize, repositoryKey: string, entityName: string, search: EntityCacheSearch<T>, isPrimary: boolean) {
    super(repositoryKey, entityName, search, isPrimary);

    this.adapter = adapter;
  }

  public async getRecordCount() {
    return await this.adapter.model(this.state.getEntityName()).count();
  }

  // Returns true if this repository is out of date
  public override getInvalid() {
    return this.state.getInvalid();
  }

  public async get(id:number) {

    if (this.state.getInvalid()) {
      throw new Error('Error: Trying to use repository when it is invalid');
    }

    return await this.adapter.model(this.state.getEntityName()).findByPk(id, {raw:true}) as T;
  }

  public async getAll() {

    if (this.state.getInvalid()) {
      throw new Error('Error: Trying to use repository when it is invalid');
    }

    return await this.adapter.model(this.state.getEntityName()).findAll({raw:true}) as T[];
  }

  public async has(id:number) {

    if (this.state.getInvalid()) {
      throw new Error('Error: Trying to use repository when it is invalid');
    }

    return await this.adapter
      .model(this.state.getEntityName())
      .findByPk(id, {raw:true})
      .then((response) => {
        return !!response;
      });
  }

  public async forEach(callback:Callback<T>){

    if (this.state.getInvalid()) {
      throw new Error('Error: Trying to use repository when it is invalid');
    }

    return await this.adapter
      .model(this.state.getEntityName())
      .findAll({raw:true})
      .then((response) => {
        response.forEach((value, index, array) => {
          callback(value as T);
        });
      });
  }

  public async anyBy(callback:Predicate<T>) {

    let hasAny = false;

    if (this.state.getInvalid()) {
      throw new Error('Error: Trying to use repository when it is invalid');
    }

    await this.adapter
      .model(this.state.getEntityName())
      .findAll({raw:true})
      .then((response) => {

        response.forEach((value, index, array) => {
          if (callback(value as T)) {
            hasAny = true;
            return;
          }
        });
      });

    return hasAny;
  }

  public async first(options:WhereOptions<T>) {

    if (this.state.getInvalid()) {
      throw new Error('Error: Trying to use repository when it is invalid');
    }

    return await this.adapter.model(this.state.getEntityName()).findOne({
      raw:true,
      where: options
    }) as T;
  }

  public async firstBy(callback:Predicate<T>) {

    let entity: T | undefined;

    if (this.state.getInvalid()) {
      throw new Error('Error: Trying to use repository when it is invalid');
    }

    await this.adapter
      .model(this.state.getEntityName())
      .findAll({raw: true})
      .then((response) => {
        response.forEach((value, index, array) => {
          if (callback(value as T)) {
            entity = value as T;
            return;
          }
        });
      });

    return entity;
  }

  public async whereBy(callback:Predicate<T>) {

    let entities: T[] = [];

    if (this.state.getInvalid()) {
      throw new Error('Error: Trying to use repository when it is invalid');
    }

    // Inefficient use of predicate (not a SQL statement)
    await this.adapter
      .model(this.state.getEntityName())
      .findAll({raw: true})
      .then((response) => {

        response.forEach((value, index, array) => {
          if (callback(value as T)) {
            entities.push(value as T);
          }
        });
      });

    return entities;
  }

  public async where(options:WhereOptions<T>) {
    return await this.adapter.model(this.state.getEntityName()).findAll({
      raw:true,
      where: options
    }) as T[];
  }

  // Returns a page of entities corresponding to the requested page; and validates against
  // the RepositoryState (missing id's + other state information)
  //
  public async getPage(pageData:PageData) {

    if (this.state.getInvalid()) {
      throw new Error('Error: Trying to use repository when it is invalid');
    }

    let offset = ((pageData.pageNumber - 1) * pageData.pageSize);

    // GOING TO HAVE TO BUILD RAW SQL FOR SKIP + TAKE (MAY REQUIRE SCHEMA PATH "public"."{table name}"
    let sql = 'SELECT * FROM ${this.state.getEntityName()} OFFSET ${offset} LIMIT ${pageData.pageSize}';

    return await this.adapter.query(sql, {raw: true}) as T[];
  }

  // Returns the page availability based on the (FILTERED) record capacity
  public override containsPage(pageData: PageData) {
    if (this.state.getInvalid()) {
      throw new Error('Error: Trying to use repository when it is invalid');
    }

    let startIndex = (pageData.pageNumber - 1) * pageData.pageSize;
    let endIndex = pageData.pageNumber * pageData.pageSize;

    if (endIndex <= startIndex ||
      endIndex < 0 ||
      startIndex < 0) {
      return EntityCachePageAvailability.Invalid;
    }

    if (this.state.getFilteredRecordCapacity() - 1 < startIndex)
      return EntityCachePageAvailability.None;

    else if (this.state.getFilteredRecordCapacity() - 1 < endIndex) {
      return EntityCachePageAvailability.Partial;
    }
    else
      return EntityCachePageAvailability.Full;
  }

  // Creates a fully-initialized child repository (with whatever data is currently available)
  createChild(additionalFilter: EntityCacheSearch<T>) {

    if (this.state.getInvalid()) {
      console.log(`Error: Trying to create child repository when it is invalid (${this.state.getKey()})`);
      return this;
    }

    // Child Repository (use special merge to gather search settings properly)
    let mergedFilter = this.state.getFilter().merge(additionalFilter);

    // Create repository with both filters applied
    return new EntityCacheServer<T>(this.adapter, this.state.getKey(), this.state.getEntityName(), mergedFilter, false);
  }

  // Calls append over the provided collection
  appendMany(entities: T[]) {

    if (!this.state.getIsPrimary()) {
      console.log(`Error: Trying to append to non-primary repository! (${this.state.getKey()})`);
      return;
    }

    if (this.state.getInvalid()) {
      console.log(`Error: Trying to use repository when it is invalid (${this.state.getKey()})`);
      return;
    }

    if (!this.state.getFilter().identity()) {
      console.log(`Error: Trying to append (from DB) to repository that has a filter (${this.state.getKey()})`);
      return;
    }

    return new Promise<T[]>((resolve, reject) => {

      let result:T[] = [];

      entities.forEach(async entity => {
        await this.append(entity)?.then(model => {
          result.push(model as T);
        }).catch(reject => {
          reject(reject);
        });
      });

      resolve(result);
    })
  }

  // Appends new record, and does NOT INVALIDATE the repository. This is used during
  // initialization; or after the search filter is set. FILTER APPLIED!
  append(entity:T) {

    if (!this.state.getIsPrimary()) {
      console.log(`Error: Trying to append to non-primary repository! (${this.state.getKey()})`);
      return;
    }

    if (this.state.getInvalid()) {
      console.log(`Error: Trying to use repository when it is invalid (${this.state.getKey()})`);
      return;
    }

    if (!this.state.getFilter().identity()) {
      console.log(`Error: Trying to append (from DB) to repository that has a filter (${this.state.getKey()})`);
      return;
    }

    // TYPE ISSUES! Some functions of Model<,> aren't implemented in class derivatives. This is making it
    //              annoying to use this ORM.
    //
    let thing:IMapType = { };

    Object.getOwnPropertyNames(entity).forEach(key => {

      // This particular key must exist
      let theKey = key as keyof typeof entity;

      thing[key] = entity[theKey];
    });

    return this.adapter.model(this.state.getEntityName()).build(thing).save();
  }

  // Removes entity from the database using a SINGLE transaction. Dependencies must be accounted-for by previous
  // removals.
  remove(entity:T) {

    if (!this.state.getIsPrimary()) {
      console.log(`Error: Trying to remove from non-primary repository! (${this.state.getKey()})`);
      return;
    }

    if (this.state.getInvalid()) {
      console.log(`Error: Trying to use repository when it is invalid (${this.state.getKey()})`);
      return;
    }

    return this.adapter.model(this.state.getEntityName()).destroy({
      where: {
        Id: entity.Id
      }
    });
  }
}
