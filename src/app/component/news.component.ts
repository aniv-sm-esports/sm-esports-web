import {Component, inject} from '@angular/core';
import {BannerLinkType, News} from '../model/news.model';
import {NewsService} from '../service/news.service';
import {DOCUMENT, NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {DomSanitizer} from '@angular/platform-browser';
import {AppService} from '../service/app.service';
import {Size} from '../model/app.model';
import {YouTubePlayer} from '@angular/youtube-player';

@Component({
  selector: 'news',
  imports: [
    NgForOf,
    NgIf,
    FormsModule,
    YouTubePlayer
  ],
  templateUrl: './template/news.component.html'
})
export class NewsComponent {

  private readonly appService: AppService;
  private readonly newsService: NewsService;
  private readonly sanitizer: DomSanitizer;
  private readonly document: Document =  inject(DOCUMENT);
  public newsList:News[];

  // BASED ON AN ASPECT RATIO OF 2:1 (can also test 16:9)
  private readonly clientSizeBase: Size = new Size(1200, 600)
  public readonly videoSizeBase: Size = new Size(640, 320);
  public sizeMultiplier: number = 1;

  constructor(appService: AppService, newsService:NewsService, sanitizer:DomSanitizer) {
    this.appService = appService;
    this.sanitizer = sanitizer;
    this.newsService = newsService;
    this.newsList = [];
  }

  ngOnInit() {

    // Get news data from server
    this.load();

    // CORS:  Sanitize the iframe links
    //this.newsList.forEach((news) => {
    //  news.bannerLinkSanitized = this.sanitizer.bypassSecurityTrustResourceUrl(news.bannerLink);
    //});

    // TODO: Figure out function generics
    //@ts-ignore
    this.appService.subscribeClientSize(value => {

      let size = value as Size;
      this.sizeMultiplier = size.width / this.clientSizeBase.width;
    });
  }

  ngAfterViewInit() {


  }

  load() {
    this.newsService
        .getAll()
        .subscribe(result => {

        // Get -> NewsService ->
        console.log("News Fetched From Server: ", result);

        this.clearNews();
        this.loadNews(result.news);
    });
  }

  clearNews(){
    for (let i = this.newsList.length - 1; i < this.newsList.length; i++) {
      this.newsList.pop();
    }
  }

  loadNews(news: News[]) {
    //news.forEach(item => {
    //  this.newsList.push(item);
    //});

    // TODO: Mock News - Data service not serializing
    let mock1 = new News();
    mock1.bannerLinkType = BannerLinkType.None;
    mock1.description = 'There\'s lots to see in the community today!';
    mock1.title = 'Welcome to Super Metroid Esports!';
    mock1.bodyHtml = this.fillerText();

    let mock2 = new News();

    mock2.id = 1;
    mock2.bannerLinkYoutubeSourceId = "ckKkywPtHAQ";
    mock2.bannerLinkType = BannerLinkType.YoutubeVideo;
    mock2.description = 'From Left to Right:  Eddie, Imyt, Andy, and Oatsngoats giving it their all at GDQ! Save the Animals!';
    mock2.title = 'Super Metroid by Andy, Oatsngoats, imyt and Eddie in 1:19:50';
    mock2.bodyHtml = this.fillerText();

    this.newsList.push(mock1);
    this.newsList.push(mock2);
  }

  fillerText() {
    return "<p>Lorem ipsum dolor sit amet consectetur <span class='link highlight'>adipiscing</span> elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.</p>"
  }

  protected readonly BannerLinkType = BannerLinkType;
}
