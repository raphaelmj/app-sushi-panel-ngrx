import { UserToken } from './../models/token-user';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserTokenSubjectService {

  action$: Subject<UserToken> = new Subject<UserToken>()

  constructor() { }

  userStream(userToken: UserToken) {
    this.action$.next(userToken)
  }

}
