import { DataSource } from "@angular/cdk/table";
import {User} from '../../model/repository/entity/user.model';
import {BehaviorSubject, map, Observable} from 'rxjs';
import {CollectionViewer, ListRange} from "@angular/cdk/collections";
import { PageInfo } from "../../model/service/page.model";
import { RepositoryEntity } from "../../model/repository/repository-entity";
import { RepositoryService } from "../../service/repository.service";
import {NgIterable} from '@angular/core';

export class EntityDataSource<T extends RepositoryEntity> extends DataSource<T> {

  private readonly dataSubject = new BehaviorSubject<T[]>([]);
  private readonly dataObservable$ = this.dataSubject.asObservable();

  constructor(private readonly service: RepositoryService<T>) {
    super();

    // <- Send
    this.service.onEntitiesChanged().subscribe(apiData => {
      /*
      this.service.get(PageInfo.first(50)).then(data => {
        this.dataSubject.next(data);
      });
      */
      this.service.get(PageInfo.first(50)).then(data => {
        this.dataSubject.next(data);
      });
    })
  }

  public trackBy(index:number, entity:RepositoryEntity) {
    return entity.id;
  }

  public onScroll(amount: number) {
    let foo = 4;
  }

  connect(collectionViewer: CollectionViewer): Observable<T[]> {

    // Listen ->
    collectionViewer.viewChange.pipe(map((response) => {

      let pageSize = response.end - response.start;
      let pageNumber = Math.ceil(response.start / pageSize);

      this.service.get(new PageInfo(pageNumber, pageSize)).then(users => {
        this.dataSubject.next(users);
      });
    }));

    // <- Send
    return this.dataSubject;
  }

  disconnect(collectionViewer: CollectionViewer): void {
  }

}
