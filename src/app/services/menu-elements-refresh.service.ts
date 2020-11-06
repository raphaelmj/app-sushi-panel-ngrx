import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MenuElementsRefreshService {

  action$: Subject<boolean> = new Subject<boolean>()

  constructor() { }

  refresh() {
    this.action$.next(true)
  }

}
