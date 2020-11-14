import { AuthState } from './../../login/reducers/index';
import { Store } from '@ngrx/store';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { UserService } from './user.service';
import { Injectable } from '@angular/core';
import { User } from '../../models/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrentAuthResolveService implements Resolve<User | null> {

  constructor(private userService: UserService, private store: Store<AuthState>) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): User | null | Observable<User | null> | Promise<User | null> {
    return this.userService.getCurrentAuthUser();
    // return this.store.pipe(take(1), select(action => action['auth'].user))
  }
}
