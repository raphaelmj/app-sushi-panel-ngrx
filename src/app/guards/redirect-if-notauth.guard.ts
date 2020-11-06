import { isLogOut } from './../login/auth.selectors';
import { first, tap, map } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { UserTokenSubjectService } from './../services/user-token-subject.service';
import { UserToken } from 'src/app/models/token-user';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from "../services/auth/user.service";
import { NavService } from '../services/auth/nav.service';
import { AuthState } from '../login/reducers';

@Injectable({
  providedIn: 'root'
})
export class RedirectIfNotauthGuard implements CanActivate {


  constructor(
    private router: Router,
    private userService: UserService,
    private navService: NavService,
    private userTokenSubjectService: UserTokenSubjectService,
    private store: Store<AuthState>
  ) {

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {

    return this.store
      .pipe(
        select(isLogOut),
        map(isAuth => {
          if (isAuth) {
            this.router.navigate(['/login'])
            return false
          } else {
            return true
          }
        })
      )
  }

  // async canActivate(
  //   next: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): Promise<boolean> {

  //   var res = await this.userService.isAuth()
  //   if (!res.success) {
  //     this.navService.hideNav()
  //     this.router.navigate(['/login']);
  //   } else {
  //     this.navService.showNav()
  //     var userToken: UserToken = await this.userService.getCurrentUserTokenData().toPromise()
  //     this.userTokenSubjectService.userStream(userToken)
  //     return true;
  //   }
  // }
}
