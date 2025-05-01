export class PageData {

  public pageNumber: number;
  public pageSize: number;

  constructor(pageNumber: number, pageSize: number) {
    this.pageNumber = pageNumber;
    this.pageSize = pageSize;
  }

  public static default() {
    return new PageData(0,0);
  }
}
