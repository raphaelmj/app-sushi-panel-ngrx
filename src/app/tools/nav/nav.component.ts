import { logout } from './../../login/auth.actions';
import { isLogIn, isSuperLogIn } from './../../login/auth.selectors';
import { map, tap } from 'rxjs/operators';
import { AuthState } from './../../login/reducers/index';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { UserTokenSubjectService } from './../../services/user-token-subject.service';
import { UserService } from './../../services/auth/user.service';
import { NavService } from './../../services/auth/nav.service';
import { API_URL } from './../../config';
import { Component, OnInit, OnDestroy } from '@angular/core';
// import { NavService } from '../services/auth/nav.service';
// import { UserService } from '../services/auth/user.service';
import { Router } from '@angular/router';
import { UserToken } from 'src/app/models/token-user';
import { UserPerm } from 'src/app/models/user';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit, OnDestroy {
  showNav: boolean = false;
  isSuper: boolean = false
  apiUrl: string = API_URL;
  subNavShow: Subscription
  subUserToken: Subscription

  constructor(
    private navService: NavService,
    private userService: UserService,
    private router: Router,
    private userTokenSubjectService: UserTokenSubjectService,
    private store: Store<AuthState>
  ) { }


  ngOnInit() {
    // this.subNavShow = this.navService.showNav$.subscribe((res) => {
    //   this.showNav = res;
    // });
    // this.subUserToken = this.userTokenSubjectService.action$.subscribe((userToken: UserToken) => {
    //   if (userToken.permission == UserPerm.super) {
    //     this.showIfSuper = true
    //   } else {
    //     this.showIfSuper = false
    //   }
    // })
    this.store
      .pipe(
        select(isLogIn),
        tap(state => {
          this.showNav = state
        })
      )
      .subscribe()
    this.store
      .pipe(
        select(isSuperLogIn),
        tap(state => {
          this.isSuper = state
        })
      )
      .subscribe()
  }

  logOut() {
    this.userService.logout().then((r) => {
      // this.router.navigate(['/']);
      this.store.dispatch(logout())
    });
  }

  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }

}
