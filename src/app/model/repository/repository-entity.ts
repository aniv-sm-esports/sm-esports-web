// TYPESCRIPT! Reflection still based on javascript, which requires an object instance
//             or prototype. Typescript does not appear to have metadata facilities - but
//             there are probably many packages to try. For now, the simple route is to
//             implements a "new" function on each child entity.
//
export abstract class RepositoryEntity {
  public id: number = 0;

  // Call to update the entity from another entity
  public abstract update<T extends RepositoryEntity>(entity:T):void;
}
