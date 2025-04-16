export class PageData {

  // Request
  public pageNumber: number;
  public pageSize: number;

  constructor() {
    this.pageNumber = 1;
    this.pageSize = 50;
  }

  public static default() {
    return new PageData();
  }

  public static firstPage(pageSize: number) {
    let result: PageData = new PageData();
    result.pageNumber = 1;
    result.pageSize = pageSize;
    return result;
  }

  public static fromRequest(pageNumber: number, pageSize: number): PageData {
    let result: PageData = new PageData();
    result.pageNumber = pageNumber;
    result.pageSize = pageSize;
    return result;
  }
  public static fromResponse(pageNumber: number, pageSize: number): PageData {
    let result: PageData = new PageData();
    result.pageNumber = pageNumber;
    result.pageSize = pageSize;
    return result;
  }
}
