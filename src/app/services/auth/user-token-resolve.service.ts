import { UserService } from './user.service';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { UserToken } from './../../models/token-user';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserTokenResolveService implements Resolve<UserToken>{

  constructor(private userService: UserService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): UserToken | Observable<UserToken> | Promise<UserToken> {
    return this.userService.getCurrentUserTokenData()
  }
}
