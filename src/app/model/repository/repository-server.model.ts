import {RepositoryEntity} from './repository-entity';
import {SearchModel, SearchModelFilter} from './search.model';
import lodash from 'lodash';
import {Repository} from './repository.model';

export class RepositoryServer<T extends RepositoryEntity> extends Repository<T> {

  constructor(repositoryKey:string, entityName:string, search:SearchModel<T>, entities:Array<T>, isPrimary:boolean) {
    super(repositoryKey, entityName, search, entities, isPrimary);
  }

  // Creates a fully-initialized child repository (with whatever data is currently available)
  createChild(additionalFilter:SearchModel<T>) {

    if (this.state.getInvalid()) {
      console.log(`Error: Trying to create child repository when it is invalid (${this.state.getKey()})`);
      return this;
    }

    // Child Repository (use special merge to gather search settings properly)
    let mergedFilter = this.state.getFilter().merge(additionalFilter);

    // Create / Load repository with both filters applied
    return new RepositoryServer<T>(this.state.getKey(), this.state.getEntityName(), mergedFilter, this.entities, false);
  }

  // Returns the :id of the next entity for this repository
  getNextId() {

    if (this.state.getInvalid()) {
      console.log(`Error: Trying to use repository when it is invalid (${this.state.getKey()})`);
      return -1;
    }

    if (this.entities.length == 0) {
      return 1;
    }

    let entityId = this.state.getUnFilteredRecordCapacity();

    // Check that :id is available
    if (!this.entityMap.has(entityId)) {
      return entityId;
    }
    else {
      return lodash.maxBy(this.entities, x => x.id)!.id + 1;
    }
  }

  // Calls append over the provided collection
  appendMany(entities:T[], invalidate:boolean) {

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

    entities.forEach(entity => {
      this.append(entity, false, invalidate);
    });
  }

  // Appends new record, and does NOT INVALIDATE the repository. This is used during
  // initialization; or after the search filter is set. FILTER APPLIED!
  append(entity:T, assignId:boolean, invalidate:boolean) {

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

    if (!this.entityMap.has(entity.id)) {

      this.entityMap.set(entity.id,entity);
      this.entities.push(entity);

      // INVALIDATE: This function is intended to add server records from the database. So, the
      //             invalid flag will force a re-sync of the client state.
      this.state.primaryAppend(1, invalidate);
    }
    else {
      if (!assignId) {
        console.log(`Error: Trying to set overwrite existing entity (by :id):  (${this.state.getKey()})`);
      }
      else {
        entity.id = this.entities.length;

        this.entityMap.set(entity.id, entity);
        this.entities.push(entity);

        // INVALIDATE: This function is intended to add server records from the database. So, the
        //             invalid flag will force a re-sync of the client state.
        this.state.primaryAppend(1, invalidate);
      }
    }
  }
}
