import { UserToken } from 'src/app/models/token-user';
import { login } from './auth.actions';
import { User } from './../models/user';
import { AuthState } from './reducers/index';
import { Component, OnInit, DoCheck } from '@angular/core';
import { UserService } from '../services/auth/user.service';
import { Router } from '@angular/router';
import { NavService } from '../services/auth/nav.service';
import { UserRole } from '../models/user';
import { Store } from '@ngrx/store';
import { tap } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, DoCheck {
  nick: string = '';
  password: string = ''; //kampiooshinek21
  role: string = UserRole.waiter;
  spinnerShow: boolean = false;
  isAuthAlert: boolean = false;
  userEmailPattern = '^[0-9a-z_.-]+@[0-9a-z.-]+.[a-z]{2,3}$';
  roles: Array<{ name: string, value: UserRole }> = [
    { name: 'Kelnerka', value: UserRole.waiter },
    { name: 'Kuchnia', value: UserRole.admin },
  ]

  constructor(
    private userService: UserService,
    private router: Router,
    private navService: NavService,
    private store: Store<AuthState>
  ) { }

  ngOnInit() {
    this.navService.hideNav();
  }

  ngDoCheck(): void {
    // console.log(this.email)
  }

  sumbmitLogin() {
    this.spinnerShow = true;
    this.userService
      .checkLoginAndMakeToken(this.nick, this.password, this.role, uuidv4())
      .pipe(
        tap(
          (res: { success: boolean; access_token: string; user?: User, userData?: User, exp?: number, uuid: string }) => {
            if (res.success) {
              let { password, status, ...userToken } = res.user
              let userT: UserToken = { ...userToken, ...{ exp: res.exp, accessToken: res.access_token, uuid: res.uuid } }
              let user: User = res.userData
              const loginAction = login({ userToken: userT, user })
              this.store.dispatch(loginAction)
            }
          }
        )
      )
      .subscribe((res: { success: boolean; access_token: string; user?: User }) => {

        this.spinnerShow = false;

        if (!res.success) {
          this.isAuthAlert = true;
        } else {
          this.isAuthAlert = false;
          this.router.navigate(['/panel']);
        }
      });
  }
}
