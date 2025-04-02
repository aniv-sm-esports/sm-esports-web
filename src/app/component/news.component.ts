import {afterNextRender, Component} from '@angular/core';
import {News} from '../model/news.model';
import {NewsService} from '../service/news.service';
import {NgForOf, NgIf} from '@angular/common';
import {take} from 'rxjs';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'news',
  imports: [
    NgForOf,
    NgIf,
    FormsModule
  ],
  templateUrl: './template/news.component.html'
})
export class NewsComponent {

  private readonly newsService: NewsService;
  public newsList:News[];

  constructor(newsService:NewsService) {

    this.newsService = newsService;
    this.newsList = [];
  }

  ngAfterViewInit() {
    this.load();
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
    let mock = new News(1, 'Super Metroid by Andy, Oatsngoats, imyt and Eddie in 1:19:50',
                                  'TBD: (Article Description) Please sign up to be the SM Esports Journalist!',
                                  'TBD: (Article Body)',
                                  new Date());

    mock.bannerLink = "https://www.youtube.com/watch?v=ckKkywPtHAQ";
    mock.bannerLinkUsed = true;

    this.newsList.push(mock);
  }
}
