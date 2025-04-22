import { DataSource } from "@angular/cdk/table";
import {User} from '../../model/repository/entity/user.model';
import {BehaviorSubject, map, Observable} from 'rxjs';
import {CollectionViewer, ListRange} from "@angular/cdk/collections";
import { Injectable } from "@angular/core";
import {UserService} from '../../service/user.service';
import { PageInfo } from "../../model/service/page.model";

export class PeopleDataSource extends DataSource<User> {

  private readonly dataSubject = new BehaviorSubject<User[]>([]);
  private readonly dataObservable$ = this.dataSubject.asObservable();

  constructor(private readonly userService: UserService) {
    super();

    // <- Send
    userService.onEntitiesChanged().subscribe(apiData => {
      userService.get(PageInfo.first(50)).then(data => {
        this.dataSubject.next(data);
      });
    })
  }

  getRecordInfo() {
    return "Records " + this.userService.getRepositoryState().filteredRecordCapacity + " of " + this.userService.getRepositoryState().unfilteredRecordCapacity;
  }

  connect(collectionViewer: CollectionViewer): Observable<User[]> {

    // Listen ->
    collectionViewer.viewChange.pipe(map((response) => {

      let pageSize = response.end - response.start;
      let pageNumber = Math.ceil(response.start / pageSize);

      this.userService.get(new PageInfo(pageNumber, pageSize)).then(users => {
        this.dataSubject.next(users);
      });
    }));

    // <- Send
    return this.dataSubject;
  }

  disconnect(collectionViewer: CollectionViewer): void {
  }

}
