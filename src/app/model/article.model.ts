import {SafeResourceUrl} from '@angular/platform-browser';

export enum BannerLinkType {
  None = 'none',
  Img = 'img',
  YoutubeVideo = 'youtube-video',
}

export class Article {

  public id: number = -1;
  public date: Date = new Date();
  public title: string = "News Article";
  public description: string = "News Atricle Description";
  public bodyHtml: string = "New Article Body";
  public bannerLinkImgUrl: string = "";
  public bannerLinkYoutubeSourceId: string = "";
  public bannerLinkType: BannerLinkType = BannerLinkType.None;

  constructor() {
  }

  public static fromYoutube(id: number,
                            title: string,
                            description: string,
                            bodyHtml:string,
                            bannerLinkYoutubeSourceId: string) {

    let result = new Article();

    result.id = id;
    result.title = title;
    result.description = description;
    result.bodyHtml = bodyHtml;
    result.bannerLinkYoutubeSourceId = bannerLinkYoutubeSourceId;
    result.bannerLinkType = BannerLinkType.YoutubeVideo;
    result.description = description;

    return result;
  }

  public static from(id: number,
                     title: string,
                     description: string,
                     bodyHtml:string,
                     bannerLinkImgUrl: string,
                     bannerLinkType: BannerLinkType,
                     bannerLinkYoutubeSourceId: string,
                     date: Date) {

    let result = new Article();

    result.id = id;
    result.date = date;
    result.bannerLinkImgUrl = bannerLinkImgUrl;
    result.bannerLinkYoutubeSourceId = bannerLinkYoutubeSourceId;
    result.bannerLinkType = bannerLinkType;
    result.description = description;
    result.title = title;
    result.bodyHtml = bodyHtml;

    return result;
  }
}
