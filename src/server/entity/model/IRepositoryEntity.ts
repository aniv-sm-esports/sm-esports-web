
export type Constructor<T> = (new () => T);

export interface IRepositoryEntity<T> {
  Id:number;

  // Typescript "constructor" syntax. Variadic arguments may added
  //new ():T;
  ctor: () => T;
}
