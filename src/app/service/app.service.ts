import {BehaviorSubject, Observable} from 'rxjs';
import {Size} from '../model/app.model';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppService {

  // DOM Window Size
  private readonly clientSize$: Observable<Size>;
  private readonly clientSizeSubject = new BehaviorSubject<Size>(new Size(0,0));
  private lastSize: Size | undefined;

  constructor() {
    this.clientSize$ = this.clientSizeSubject.asObservable();
  }

  getSize(){
    return this.lastSize;
  }


  subscribeClientSize(callback: Function) {
    this.clientSize$.subscribe(size => {

      // Cache the size here
      this.lastSize = size;

      callback(size);
    });
  }

  updateClientSize(size: Size) {
    this.clientSizeSubject.next(size);
  }
}
