import {BehaviorSubject, Observable} from 'rxjs';
import {Size} from '../model/app.model';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppService {

  // DOM Window Size
  private readonly clientSize$: Observable<Size>;
  private readonly clientSizeSubject = new BehaviorSubject<Size>(Size.default());

  private lastSize: Size = Size.default();
  private lastBodySize: Size = Size.default();

  private readonly clientSizeBase: Size = Size.from(1200, 600);
  private readonly videoSizeBase: Size = Size.from(640, 320);
  private sizeMultiplier:number = 1;

  public mediaLarge: number = 1400;
  public bodyMargin: number = 20;
  public bannerHeightSmall: number = 48.6;
  public bannerHeightLarge: number = 68;

  constructor() {
    this.clientSize$ = this.clientSizeSubject.asObservable();
  }

  getSize(){
    return this.lastSize;
  }

  getBodySize(){
    return this.lastBodySize;
  }

  // TODO: Finish media queries; and add size enumeration
  getVideoSize(){

    // Get last cached size
    let size = this.getSize();

    if (size)
      this.sizeMultiplier = size.width / this.clientSizeBase.width;

    return Size.from(this.videoSizeBase.width * this.sizeMultiplier, this.videoSizeBase.height * this.sizeMultiplier);
  }

  getBannerHeight(){
    if (this.getSize()?.width || 0 > this.mediaLarge){
      return this.bannerHeightLarge;
    }
    else
      return this.bannerHeightSmall;
  }

  subscribeClientSize(callback: Function) {
    this.clientSize$.subscribe(size => {
      callback(size);
    });
  }

  updateClientSize(size: Size) {

    // Cache the size here
    this.lastSize = size;

    if (!this.lastBodySize)
      this.lastBodySize = Size.from(size.width - (2 * this.bodyMargin), size.height - (2 * this.bodyMargin) - this.getBannerHeight());

    else{
      this.lastBodySize.width = size.width - (2 * this.bodyMargin);
      this.lastBodySize.height = size.height - (2 * this.bodyMargin) - this.getBannerHeight();
    }

    this.clientSizeSubject.next(size);
  }
}
