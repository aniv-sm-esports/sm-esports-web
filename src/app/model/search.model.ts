
export type MapType = {
  [id: string]: string;
}

export class SearchModel<T> {

  // Object key -> search string map (TODO: Handle generic property types)
  public searchMap:MapType = {};

  constructor() {
  }

  public get(key: string) {
    return this.searchMap[key];
  }

  public set(key: string, value: string) {
    this.searchMap[key] = value;
  }

  public has(key: string): boolean {
    return !!this.searchMap[key];
  }

  public static default<T>() {
    return new SearchModel<T>();
  }
}
