import {afterNextRender, Component, DestroyRef, HostListener, inject} from '@angular/core';
import {UserService} from '../service/user.service';
import {ApiResponseType, Size} from '../model/service/app.model';
import {AppService} from '../service/app.service';
import {AuthService} from '../service/auth.service';
import {UserJWT} from '../model/repository/user-logon.model';
import {AuthHandler} from '../model/service/handler.model';
import moment from 'moment';
import {faBars, faCircle, faEnvelope} from '@fortawesome/free-solid-svg-icons';
import {faGithub, faTwitch} from '@fortawesome/free-brands-svg-icons';
import {
  ActivatedRoute, ActivatedRouteSnapshot,
  Data,
  DefaultTitleStrategy,
  NavigationEnd,
  ResolveFn,
  Router,
  TitleStrategy
} from '@angular/router';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {concatAll, filter, map, switchMap, takeLast} from 'rxjs';
import {Tab} from '../model/view/tab.model';

@Component({
  selector: 'app-root',
  templateUrl: './template/app.component.html',
  standalone: false
})
export class AppComponent implements AuthHandler {

  protected readonly router:Router;
  protected readonly activatedRoute:ActivatedRoute;
  protected readonly appService: AppService;
  private readonly userService: UserService;

  // Font Awesome
  public faBars = faBars;
  public faCircle = faCircle;

  // PRIMARY USER MODEL:  This should store user's data (could be relocated to user service.. which
  //                      would then be the "user's service"
  public primaryUserLogon: UserJWT;
  public primaryUserLoggedOn: boolean;

  // The size of the body will be dynamically set during resize / load events
  //
  public showSideNavRight: boolean = false;
  public showSideNavLeft: boolean = false;
  public showChatNavTree: boolean = false;
  public showPeopleNavTree: boolean = false;
  public showHomeNavTree: boolean = false;
  public showCollabNavTree: boolean = false;
  public showLandscapeNavTree: boolean = false;

  // Activated Routes:  Need some information about what to display
  //
  private readonly destroyRef = inject(DestroyRef);
  public routeTitle:string = '';
  public routeTabs:Tab[] = [];

  // App.Spec (TODO! Keep this!)
  public title = 'sm-esports-web';
  public loading: boolean = false;

  constructor(router:Router, activatedRoute:ActivatedRoute, appService: AppService, userService: UserService, authService: AuthService) {

    this.router = router;
    this.activatedRoute = activatedRoute;
    this.appService = appService;
    this.primaryUserLogon = UserJWT.default();
    this.primaryUserLoggedOn = false;
    this.userService = userService;

    // User Logon Listener
    //
    authService.subscribeLogonChanged(this);
    authService.refreshSession();
  }

  ngOnInit() {

    // Loading... (see Angular lifecycle)
    this.loading = true;

    // Wait for logon event
    this.primaryUserLoggedOn = false;

    // Reset route tabs
    this.routeTabs = [];

    // Get route title from router-outlet component
    this.router.events.pipe(
      takeUntilDestroyed(this.destroyRef),
      filter(e => e instanceof NavigationEnd),
      map(() => {
        let route: ActivatedRoute = this.router.routerState.root;
        while (route!.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
    ).subscribe((activatedRoute) => {
      this.routeTitle = activatedRoute.snapshot.title || '';
      this.routeTabs = [];

      // Add tabs to the route (banner)
      if (activatedRoute.routeConfig?.data){

        Object.keys(activatedRoute.routeConfig.data).map((value, index, next) =>{
          if (activatedRoute.routeConfig?.data![value]){
            let tab = activatedRoute.routeConfig?.data![value] as Tab;
            this.routeTabs.push(tab);
          }
        });
      }
    });
  }

  ngAfterViewInit() {

    // Must lift this off the call stack to avoid life-cycle clash
    //
    setTimeout(() => {
      this.loading = false;
    });

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

  @HostListener('window:load', ['$event'])
  onLoad(event: Event) {
    if (!this.appService || !event || !event.currentTarget)
      return;

    // Window + Body Size (NOTE: event.target != event.currentTarget)
    //
    // AppService -> Observable / BehaviorSubscriber -> ...
    this.appService.updateClientSize(Size.from((event.currentTarget as Window).innerWidth, (event.currentTarget as Window).innerHeight));
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    if (!this.appService || !event || !event.currentTarget)
      return;

    // Window + Body Size (NOTE: event.target != event.currentTarget)
    //
    // AppService -> Observable / BehaviorSubscriber -> ...
    this.appService.updateClientSize(Size.from((event.target as Window).innerWidth, (event.target as Window).innerHeight));
  }

  onSideNavOffClick() {
    this.showSideNavLeft = false;
    this.showSideNavRight = false;
  }

  protected readonly moment = moment;
  protected readonly faGithub = faGithub;
  protected readonly faEnvelope = faEnvelope;
}
