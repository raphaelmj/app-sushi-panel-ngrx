import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MenuCategoryRefreshService {

  action$: Subject<boolean> = new Subject<boolean>()

  constructor() { }

  refresh() {
    this.action$.next(true)
  }

}
