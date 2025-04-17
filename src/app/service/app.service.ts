import {BehaviorSubject, Observable} from 'rxjs';
import {Size} from '../model/service/app.model';
import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {AuthHandler} from '../model/service/handler.model';
import {UserJWT} from '../model/service/user-logon.model';

@Injectable({
  providedIn: 'root',
})
export class AppService implements AuthHandler {

  // DOM Window Size
  private readonly clientSize$: Observable<Size>;
  private readonly clientSizeSubject = new BehaviorSubject<Size>(Size.default());

  // PRIMARY USER MODEL:  This should store user's data (could be relocated to user service.. which
  //                      would then be the "user's service"
  public primaryUserLogon: UserJWT;
  public primaryUserLoggedOn: boolean;

  // MEDIA SIZING:  The one-page style went from a body contained layout to a virtual scroller. So,
  //                some of these will be refactored away.
  //
  private lastSize: Size = Size.default();
  private lastBodySize: Size = Size.default();

  private readonly clientSizeBase: Size = Size.from(1200, 600);
  private readonly videoSizeBase: Size = Size.from(640, 320);
  private sizeMultiplier:number = 1;

  public mediaLarge: number = 1400;
  public bodyMargin: number = 20;
  public bannerHeightSmall: number = 48.6;
  public bannerHeightLarge: number = 68;

  constructor(protected authService:AuthService) {
    this.clientSize$ = this.clientSizeSubject.asObservable();

    this.primaryUserLogon = UserJWT.default();
    this.primaryUserLoggedOn = false;

    // User Logon Listener
    //
    authService.subscribeLogonChanged(this);
    authService.refreshSession();
  }

  onLoginChanged(value: UserJWT){

    if (!value) {
      this.primaryUserLogon = UserJWT.default();
      this.primaryUserLoggedOn = false;
    }

    else {
      this.primaryUserLogon = value;
      this.primaryUserLoggedOn = !value.isDefault();
    }
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
