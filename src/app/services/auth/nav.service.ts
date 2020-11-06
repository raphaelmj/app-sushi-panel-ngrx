import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable()
export class NavService {
  showNav$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  showNav() {
    this.showNav$.next(true);
  }

  hideNav() {
    this.showNav$.next(false);
  }
}
