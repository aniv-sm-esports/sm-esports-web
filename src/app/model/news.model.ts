export class News {
  public id: number = -1;
  public date: Date = new Date();
  public title: string = "News Article";
  public description: string = "News Atricle Description";
  public bodyHtml: string = "New Article Body";
  public bannerLink: string;
  public bannerLinkUsed: boolean;

  constructor(id: number, title: string, description: string, bodyHtml: string, date: Date) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.bodyHtml = bodyHtml;
    this.date = date;
    this.bannerLink = '';
    this.bannerLinkUsed = false;
  }

  public static default(){
    let news = new News(-1, "", "", "", new Date());

    news.bannerLink = '';
    news.bannerLinkUsed = false;

    return news;
  }
}
export class NewsResponse{
  public news: News[];
  public success: boolean = false;
  public message: string = "";

  public constructor(news: News[], success: boolean, message: string) {
    this.news = news;
    this.success = success;
    this.message = message;
  }

  public static default() {
    return new NewsResponse([], false, '');
  }
}
