import {afterNextRender, Component, inject} from '@angular/core';
import {BannerLinkType, Article} from '../../../model/repository/entity/article.model';
import {NewsService} from '../../../service/news.service';
import {NgForOf, NgIf, NgStyle} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {AppService} from '../../../service/app.service';
import {Size} from '../../../model/service/app.model';
import {YouTubePlayer} from '@angular/youtube-player';
import {PageData} from '../../../model/service/page.model';
import moment from 'moment';

@Component({
  selector: 'news',
  imports: [
    NgForOf,
    NgIf,
    FormsModule,
    YouTubePlayer
  ],
  templateUrl: '../../template/view/home/home-news.component.html'
})
export class HomeNewsComponent {

  protected readonly appService: AppService;
  private readonly newsService: NewsService;
  public newsList:Article[];

  // BASED ON AN ASPECT RATIO OF 2:1 (can also test 16:9)
  private readonly clientSizeBase: Size = Size.from(1200, 600)
  public readonly videoSizeBase: Size = Size.from(640, 320);
  public sizeMultiplier: number = 1;

  constructor(appService: AppService, newsService:NewsService) {
    this.appService = appService;
    this.newsService = newsService;
    this.newsList = [];

    // TODO: Figure out function generics
    //@ts-ignore
    this.appService.subscribeClientSize(value => {

      // NOTE: The AppService also caches this value, so we can use our common function
      this.updateSize();
    });
  }

  ngOnInit() {

    // Get news data from server
    this.load();
  }

  ngAfterViewInit() {
    this.refreshYoutube();
  }

  refreshYoutube(){
    this.updateSize();
  }

  updateSize(){

    // Get last cached size
    let size = this.appService.getSize();

    if (size)
      this.sizeMultiplier = size.width / this.clientSizeBase.width;
  }


  load() {
    this.newsService
        .getAll()
        .then(result => {

        // Get -> NewsService ->
        console.log("News Fetched From Server: ", result);

        this.clearNews();
        this.loadNews(result);
    });
  }

  clearNews(){
    for (let i = this.newsList.length - 1; i < this.newsList.length; i++) {
      this.newsList.pop();
    }
  }

  loadNews(news: Article[]) {
    news.forEach(item => {
      this.newsList.push(item);
    });
  }

  protected readonly BannerLinkType = BannerLinkType;
}
