import {BehaviorSubject, Observable} from 'rxjs';
import {Size} from '../model/app.model';
import {Injectable} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AppService {

  // DOM Window Size
  private readonly clientSize$: Observable<Size>;
  private readonly clientSizeSubject = new BehaviorSubject<Size>(new Size(0,0));

  private lastSize: Size | undefined;
  private lastBodySize: Size | undefined;

  public mediaLarge: number = 1400;
  public bodyMargin: number = 20;
  public bannerHeightSmall: number = 48.6;
  public bannerHeightLarge: number = 68;
  public bannerHeight: number = this.bannerHeightSmall;     // Responsive setting

  constructor() {
    this.clientSize$ = this.clientSizeSubject.asObservable();
  }

  getSize(){
    return this.lastSize;
  }

  getBodySize(){
    return this.lastBodySize;
  }

  subscribeClientSize(callback: Function) {
    this.clientSize$.subscribe(size => {
      callback(size);
    });
  }

  updateClientSize(size: Size) {

    // Cache the size here
    this.lastSize = size;

    // Responsive Banner Height
    //
    if (this.lastSize.width > this.mediaLarge)
      this.bannerHeight = this.bannerHeightLarge;
    else
      this.bannerHeight = this.bannerHeightSmall;

    this.clientSizeSubject.next(size);
  }
}
