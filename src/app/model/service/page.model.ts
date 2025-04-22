export class PageData {

  // Request
  public pageNumber: number;
  public pageSize: number;

  constructor(pageNumber: number, pageSize: number) {
    this.pageNumber = pageNumber;
    this.pageSize = pageSize;
  }

  public getStartIndex() {
    return (this.pageNumber - 1) * this.pageSize;
  }
  public getEndIndex() {
    return this.pageNumber * this.pageSize;
  }

  public static default() {
    return new PageData(0,0);
  }
}

export class PageInfo {

  protected pageNumber: number;
  protected pageSize: number;
  protected totalRecordCount: number;
  protected filteredRecordCount: number;

  constructor(pageNumber:number, pageSize:number) {
    this.pageNumber = pageNumber;
    this.pageSize = pageSize;
    this.totalRecordCount = 0;
    this.filteredRecordCount = 0;
  }

  getPageNumber() {return this.pageNumber;}
  getPageSize() {return this.pageSize;}
  getTotalCount() {return this.totalRecordCount;}
  getFilteredCount() {return this.filteredRecordCount;}

  set(totalRecordCount:number, filteredRecordCount:number){
    this.totalRecordCount = totalRecordCount;
    this.filteredRecordCount = filteredRecordCount;
  }

  public static first(pageSize:number): PageInfo {
    return new PageInfo(1, pageSize);
  }

  public static default() {
    return new PageInfo(0,0);
  }
}
