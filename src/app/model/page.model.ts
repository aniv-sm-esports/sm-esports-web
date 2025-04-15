export class PageData {
  public pageNumber: number;
  public pageSize: number;
  public totalRecords: number;
  public totalPages: number;

  constructor() {
    this.pageNumber = 1;
    this.pageSize = 50;
    this.totalPages = 1;
    this.totalRecords = 0;
  }

  public static default() {
    return new PageData();
  }

  public static fromRequest(pageNumber: number, pageSize: number): PageData {
    let result: PageData = new PageData();
    result.pageNumber = pageNumber;
    result.pageSize = pageSize;
    return result;
  }
  public static fromResponse(pageNumber: number, pageSize: number, totalRecords:number): PageData {
    let result: PageData = new PageData();
    result.pageNumber = pageNumber;
    result.pageSize = pageSize;
    result.totalRecords = totalRecords;
    result.totalPages = Math.ceil(totalRecords / pageSize);
    return result;
  }
}
