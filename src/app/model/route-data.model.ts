import {Tab} from './tab.model';

export class RouteData {
  public navigationTabs:Tab[] = [];

  public constructor(){}

  public static default() {
    return new RouteData();
  }

  public static from(tabs: Tab[]): RouteData {
    let routeData = new RouteData();
    routeData.navigationTabs = tabs;
    return routeData;
  }
}
