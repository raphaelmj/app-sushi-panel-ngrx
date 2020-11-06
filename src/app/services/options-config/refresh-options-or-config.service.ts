import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export enum OptionOrConfig {
  desc = "desc",
  reverse = "reverse",
  config = "config"
}

@Injectable({
  providedIn: 'root'
})
export class RefreshOptionsOrConfigService {

  subject$: Subject<OptionOrConfig> = new Subject<OptionOrConfig>()

  constructor() { }

  makeRefresh(what: OptionOrConfig) {
    this.subject$.next(what)
  }

}
