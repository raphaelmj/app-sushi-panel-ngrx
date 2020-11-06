import { Store, select } from '@ngrx/store';
import { UserToken } from '../models/token-user';
import { UserService } from './../services/auth/user.service';
import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserPerm } from '../models/user';
import { AuthState } from '../login/reducers';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProtectBySuperGuard implements CanActivate, CanLoad {

  constructor(private userService: UserService, private store: Store<AuthState>) {

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    return this.store.pipe(
      select(state => {
        return state['auth'].userToken.permission == UserPerm.super
      })
    )
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> {
    return this.store.pipe(
      take(1),
      select(state => {
        return state['auth'].userToken.permission == UserPerm.super
      })
    )
  }

  // async canActivate(
  //   next: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): Promise<boolean | UrlTree> {
  //   var userToken: UserToken = await this.userService.getCurrentUserTokenData().toPromise()
  //   return userToken.permission == UserPerm.super;
  // }
  // async canLoad(
  //   route: Route,
  //   segments: UrlSegment[]): Promise<boolean> {
  //   var userToken: UserToken = await this.userService.getCurrentUserTokenData().toPromise()
  //   return userToken.permission == UserPerm.super;
  // }
}
